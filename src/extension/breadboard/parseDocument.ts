import vscode from 'vscode'
import { Breadboard } from '../../BreadboardTypes'
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
        return Promise.resolve(breadboard)
    } catch {
        vscode.window.showInformationMessage('Could not parse jsonnet file')
        return Promise.reject(new Error('Could not parse jsonnet file'))
    }
}
