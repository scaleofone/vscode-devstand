import vscode from 'vscode'
import { Breadboard, TemplateSchema } from '../../BreadboardTypes'
import * as parser from './jsonnet/JsonnetParser'
import * as converter from './jsonnet/BreadbordConverter'
import findAvailableTemplates from './findAvailableTemplates'

export default async function(document: vscode.TextDocument): Promise<Breadboard> {
    const text = document.getText()
    if (text.trim().length === 0) {
        return Promise.resolve({
            schemaDictionary: [],
            templateImports: [],
            components: [],
            records: [],
        })
    }
    const msecStart = (new Date()).getTime()
    try {
        const parsed = parser.parse(document.uri.path, text)
        const breadboard = converter.toBreadboard(
            parser.getLocalBindNodes(parsed),
            parser.getObjectNode(parsed)
        )
        // PERF do not look up (and then parse) every available template
        // define paths of `breadboard-meta.json` files based on `breadboard.templateImports.map(ti => ti.targetFile)`
        let availableTemplates = await findAvailableTemplates()
        breadboard.schemaDictionary = availableTemplates.filter(dictItem => (
            breadboard.templateImports.findIndex(ti => (
                ti.targetFile == dictItem.targetFile && ti.targetIdentifier == dictItem.targetIdentifier
            )) != -1
        ))
        let schemaPerComponent = breadboard.components.reduce((obj, c) => {
            let ti = breadboard.templateImports.find(ti => ti.variableName == c.templateImportVariableName)
            let sdi = breadboard.schemaDictionary.find(sdi => sdi.targetFile == ti.targetFile && sdi.targetIdentifier == ti.targetIdentifier)
            obj[c.identifier] = sdi.schema
            return obj
        }, {})
        for (let record of breadboard.records) {
            let schema: TemplateSchema = schemaPerComponent[record.componentIdentifier]
            // TODO support deeper nesting of scope
            if (record.scope && record.scope.indexOf('.') == -1) {
                const scopedSchema = schema.properties[record.scope]
                if (typeof scopedSchema == 'object' && scopedSchema && scopedSchema.type == 'object') {
                    if (typeof scopedSchema.properties == 'object' && Object.keys(scopedSchema.properties).includes(record.identifier)) {
                        record.inSchema = true
                    } else if (typeof scopedSchema.patternProperties == 'object') {
                        for (let pattern of Object.keys(scopedSchema.patternProperties)) {
                            try {
                                if (record.identifier.match(new RegExp(pattern))) {
                                   record.inSchema = true
                                   break
                                }
                            } catch (error) { /* do nothing */ }
                        }
                    }
                }
            } else if (! record.scope) {
                if (Object.keys(schema.properties).includes(record.identifier)) {
                    record.inSchema = true
                }
            }
        }
        const msecEnd = (new Date()).getTime()
        console.log('function parseDocument took '+((msecEnd - msecStart) / 1000)+' seconds')
        return Promise.resolve(breadboard)
    } catch {
        vscode.window.showInformationMessage('Could not parse jsonnet file')
        return Promise.reject(new Error('Could not parse jsonnet file'))
    }
}
