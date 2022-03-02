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
        breadboard.records = breadboard.records.filter(record => record.inSchema)

        // Store geometry data within each Component
        let usedColorIndexes = []
        for (let c = 0; c < breadboard.components.length; c++) {
            try {
                const geometry = geometryForComponent(breadboard.components[c].identifier, breadboard.meta)
                breadboard.components[c] = { ...breadboard.components[c], ...geometry }
                usedColorIndexes.push(geometry.colorIndex)
            } catch (err) { /* do nothing */}
        }
        let availableColorIndexes = []
        for (let a = 0; a < 50; a++) {
            if (! usedColorIndexes.includes(a)) {
                availableColorIndexes.push(a)
            }
        }
        for (let c = 0; c < breadboard.components.length; c++) {
            if (typeof breadboard.components[c].colorIndex == 'undefined') {
                breadboard.components[c] = {...breadboard.components[c], colorIndex: availableColorIndexes.shift(), cornerY: 0, cornerX: 0 }
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

function geometryForComponent(identifier: string, meta: object): { cornerY: number, cornerX: number, colorIndex: number } {
    const geometry = ((typeof meta == 'object' && meta && 'geometry' in meta && identifier in meta['geometry']) ? meta['geometry'][identifier] : '').split(',')
    if (geometry.length != 3) {
        throw 'corrupted geomety'
    }
    return {
        cornerY: parseInt(geometry[0]),
        cornerX: parseInt(geometry[1]),
        colorIndex: parseInt(geometry[2]),
    }
}
