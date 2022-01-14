import vscode from 'vscode'
import { Breadboard } from './jsonnet/BreadboardTypes'
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
        const ast = parser.parseAst(document.uri.path, text)
        if (! ast.type) throw new Error('ast[type] attr is missing')
        const breadboard = converter.toBreadboard(
            parser.getLocalBindNodes(ast),
            parser.getObjectNode(ast)
        )
        return Promise.resolve(breadboard)
    } catch {
        vscode.window.showInformationMessage('Could not parse jsonnet file')
        return Promise.reject(new Error('Could not parse jsonnet file'))
    }
}
