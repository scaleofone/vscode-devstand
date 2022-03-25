import vscode from 'vscode'
import { RenameComponent } from '../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

export default function (document: vscode.TextDocument, payload: RenameComponent): vscode.TextEdit {
    const parsed = parser.parse(document.uri.path, document.getText())
    const objectFieldNode = parser.getComponentFieldNode(parsed, payload.before)

    return vscode.TextEdit.replace(
        new vscode.Range(
            objectFieldNode.id.loc.begin.line - 1,
            objectFieldNode.id.loc.begin.column - 1,
            objectFieldNode.id.loc.end.line - 1,
            objectFieldNode.id.loc.end.column - 1
        ),
        payload.after
    )
}
