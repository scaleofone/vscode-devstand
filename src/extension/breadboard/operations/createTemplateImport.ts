import vscode from 'vscode'
import { CreateTemplateImport } from '../../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

export default async function (document: vscode.TextDocument, payload: CreateTemplateImport) {
    const text = document.getText()
    const parsed = parser.parse(document.uri.path, text)
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
    const insertText = `\nlocal ${ payload.variableName } = (import '${ payload.targetFile }').${ payload.targetIdentifier };`

    const edit = new vscode.WorkspaceEdit()
    edit.insert(
        document.uri,
        new vscode.Position(
            insertLine,
            insertColumn
        ),
        insertText
    )
    return vscode.workspace.applyEdit(edit)
}
