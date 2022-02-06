import vscode from 'vscode'
import * as ast from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast'

import { UpdateRecordValue } from '../../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

export default function (document: vscode.TextDocument, payload: UpdateRecordValue): vscode.TextEdit {
    const text = document.getText()
    const parsed = parser.parse(document.uri.path, text)
    const recordFieldNode = parser.getRecordFieldNode(parsed, payload.componentIdentifier, payload.recordIdentifier)
    const targetNode = recordFieldNode.expr2

    if (! (
        ast.isLiteralStringSingle(targetNode)
        || ast.isLiteralStringDouble(targetNode)
        || ast.isLiteralNumber(targetNode)
    )) {
        vscode.window.showErrorMessage(`node[type=${ targetNode.type }] is unsupported`)
        return
    }

    return vscode.TextEdit.replace(
        new vscode.Range(
            targetNode.loc.begin.line -1,
            targetNode.loc.begin.column -1,
            targetNode.loc.end.line -1,
            targetNode.loc.end.column -1
        ),
        payload.updateRecordValue.toString()
    )
}
