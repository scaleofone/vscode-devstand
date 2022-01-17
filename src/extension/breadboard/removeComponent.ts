import vscode from 'vscode'
import { RemoveComponent } from '../../TransportPayloads'

import * as parser from './jsonnet/JsonnetParser'

export default async function (document: vscode.TextDocument, payload: RemoveComponent) {
    const text = document.getText()
    const parsed = parser.parse(document.uri.path, text)
    const objectNode = parser.getObjectNode(parsed)
    const objectFieldNode = objectNode.fields.find(objectFieldNode => objectFieldNode.id.name == payload.identifier)
    if (objectFieldNode == undefined) {
        vscode.window.showErrorMessage(`Could not find Component[identifier=${ payload.identifier }]`)
        return
    }

    let beginLine = objectFieldNode.loc.begin.line - 1
    let beginColumn = objectFieldNode.loc.begin.column - 1
    if ('' == document.getText(new vscode.Range(beginLine, 0, beginLine, beginColumn)).trim()) {
        // if the start of the line is whitespace => delete starting at the beginning of the line
        beginColumn = 0
    }
    let endLine = objectFieldNode.loc.end.line - 1
    let endColumn = objectFieldNode.loc.end.column - 1
    if (',' == document.getText(new vscode.Range(endLine, endColumn, endLine, endColumn+1))) {
        endColumn += 1
    }
    if ('' == document.getText(new vscode.Range(endLine, endColumn, endLine, endColumn+50)).trim()) {
        // if the rest of the line is whitespace => delete all utill the beginning of the next line
        endLine += 1
        endColumn = 0
    }

    const edit = new vscode.WorkspaceEdit()
    edit.delete(
        document.uri,
        new vscode.Range(
            beginLine,
            beginColumn,
            endLine,
            endColumn,
        )
    )
    return vscode.workspace.applyEdit(edit)
}