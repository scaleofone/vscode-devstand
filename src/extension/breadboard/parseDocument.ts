import vscode from 'vscode'
import { Breadboard } from '../../BreadboardTypes'
import * as parser from './jsonnet/JsonnetParser'
import * as converter from './jsonnet/BreadbordConverter'

export default async function(document: vscode.TextDocument): Promise<Breadboard> {
    const text = document.getText()
    if (text.trim().length === 0) {
        return Promise.resolve({
            templateImports: [],
            components: [],
        })
    }
    try {
        const parsed = parser.parse(document.uri.path, text)
        const breadboard = converter.toBreadboard(
            parser.getLocalBindNodes(parsed),
            parser.getObjectNode(parsed)
        )
        return Promise.resolve(breadboard)
    } catch {
        vscode.window.showInformationMessage('Could not parse jsonnet file')
        return Promise.reject(new Error('Could not parse jsonnet file'))
    }
}
