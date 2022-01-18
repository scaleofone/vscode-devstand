import vscode from 'vscode'
import { RenameComponent } from '../../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

export default async function (document: vscode.TextDocument, payload: RenameComponent) {
    const text = document.getText()
    const parsed = parser.parse(document.uri.path, text)
    const objectFieldNode = parser.getComponentFieldNode(parsed, payload.before)

    const edit = new vscode.WorkspaceEdit()
    edit.replace(
        document.uri,
        new vscode.Range(
            objectFieldNode.id.loc.begin.line - 1,
            objectFieldNode.id.loc.begin.column - 1,
            objectFieldNode.id.loc.end.line - 1,
            objectFieldNode.id.loc.end.column - 1
        ),
        payload.after
    )
    return vscode.workspace.applyEdit(edit)
}
