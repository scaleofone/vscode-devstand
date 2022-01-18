import vscode from 'vscode'
import * as ast from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast'

import { UpdateRecordValue } from '../../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

export default async function (document: vscode.TextDocument, payload: UpdateRecordValue) {
    const text = document.getText()
    const parsed = parser.parse(document.uri.path, text)
    const recordFieldNode = parser.getRecordFieldNode(parsed, payload.componentIdentifier, payload.recordIdentifier)

    if (! (
        ast.isLiteralStringSingle(recordFieldNode.expr2)
        || ast.isLiteralStringDouble(recordFieldNode.expr2)
        || ast.isLiteralNumber(recordFieldNode.expr2)
    )) {
        vscode.window.showErrorMessage(`node[type=${ recordFieldNode.expr2.type }] is unsupported`)
        return
    }

    const edit = new vscode.WorkspaceEdit()
    edit.replace(
        document.uri,
        new vscode.Range(
            recordFieldNode.expr2.loc.begin.line -1,
            recordFieldNode.expr2.loc.begin.column -1,
            recordFieldNode.expr2.loc.end.line -1,
            recordFieldNode.expr2.loc.end.column -1
        ),
        payload.updateRecordValue.toString()
    )
    return vscode.workspace.applyEdit(edit)
}
