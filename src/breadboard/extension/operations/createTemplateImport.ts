import vscode from 'vscode'
import { CreateTemplateImport } from '../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

export default function (document: vscode.TextDocument, payload: CreateTemplateImport): vscode.TextEdit {
    const parsed = parser.parse(document.uri.path, document.getText())
    const localBindNodes = parser.getLocalBindNodes(parsed)
    const lastLocalBindNode = localBindNodes.length > 0 ? localBindNodes[localBindNodes.length-1] : undefined

    let insertLine = 0, insertColumn = 0
    if (lastLocalBindNode) {
        insertLine = lastLocalBindNode.loc.end.line -1
        insertColumn = lastLocalBindNode.loc.end.column -1
        if (';' == document.getText(new vscode.Range(insertLine, insertColumn, insertLine, insertColumn+1))) {
            insertColumn += 1
        }
    }

    let insertText = `local ${ payload.variableName } = (import '${ payload.targetFile }').${ payload.targetIdentifier };`
    if (lastLocalBindNode) {
        insertText = '\n' + insertText
    } else {
        insertText = insertText + '\n' + '\n'
    }

    return vscode.TextEdit.insert(
        new vscode.Position(insertLine, insertColumn),
        insertText
    )
}
