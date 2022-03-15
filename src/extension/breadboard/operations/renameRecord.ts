import vscode from 'vscode'
import * as ast from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast'

import { RenameRecord } from '../../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

export default function (document: vscode.TextDocument, payload: RenameRecord): vscode.TextEdit {
    const text = document.getText()
    const parsed = parser.parse(document.uri.path, text)
    const recordFieldNode = parser.getRecordFieldNode(parsed, payload.componentIdentifier, payload.recordIdentifier, payload.recordScope)

    return vscode.TextEdit.replace(
        new vscode.Range(
            recordFieldNode.id.loc.begin.line - 1,
            recordFieldNode.id.loc.begin.column - 1,
            recordFieldNode.id.loc.end.line - 1,
            recordFieldNode.id.loc.end.column - 1
        ),
        payload.renameRecordIdentifier
    )
}
