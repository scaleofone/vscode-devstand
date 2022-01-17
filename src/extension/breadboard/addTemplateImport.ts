import vscode from 'vscode'
import { AddTemplateImport } from '../../TransportPayloads'

import * as parser from './jsonnet/JsonnetParser'

export default async function (document: vscode.TextDocument, payload: AddTemplateImport) {
    const text = document.getText()
    const parsed = parser.parse(document.uri.path, text)
    const localBindNodes = parser.getLocalBindNodes(parsed)
    const lastLocalBindNode = localBindNodes.length > 0 ? localBindNodes[localBindNodes.length-1] : undefined
    let beginLine = 0, beginColumn = 0, endLine = 0, endColumn = 0
    if (lastLocalBindNode) {
        endLine = beginLine = lastLocalBindNode.loc.end.line -1
        endColumn = beginColumn = lastLocalBindNode.loc.end.column // do not -1 because the next char is semi-colon (;)
    }
    const insertText = `\nlocal ${ payload.variableName } = (import '${ payload.targetFile }').${ payload.targetIdentifier };`

    const edit = new vscode.WorkspaceEdit()
    edit.replace(
        document.uri,
        new vscode.Range(
            beginLine,
            beginColumn,
            endLine,
            endColumn
        ),
        insertText
    )
    return vscode.workspace.applyEdit(edit)
}
