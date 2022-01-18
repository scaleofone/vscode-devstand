import vscode from 'vscode'
import * as ast from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast'

import { RenameRecord } from '../../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

export default async function (document: vscode.TextDocument, payload: RenameRecord) {
    const text = document.getText()
    const parsed = parser.parse(document.uri.path, text)
    const recordFieldNode = parser.getRecordFieldNode(parsed, payload.componentIdentifier, payload.recordIdentifier)

    const edit = new vscode.WorkspaceEdit()
    edit.replace(
        document.uri,
        new vscode.Range(
            recordFieldNode.id.loc.begin.line - 1,
            recordFieldNode.id.loc.begin.column - 1,
            recordFieldNode.id.loc.end.line - 1,
            recordFieldNode.id.loc.end.column - 1
        ),
        payload.renameRecordIdentifier
    )
    return vscode.workspace.applyEdit(edit)
}
