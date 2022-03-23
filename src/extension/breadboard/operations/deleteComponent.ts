import vscode from 'vscode'
import { DeleteComponent } from '../../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

export default function (document: vscode.TextDocument, payload: DeleteComponent): vscode.TextEdit {
    const parsed = parser.parse(document.uri.path, document.getText())
    const objectFieldNode = parser.getComponentFieldNode(parsed, payload.identifier)

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

    return vscode.TextEdit.delete(
        new vscode.Range(beginLine, beginColumn, endLine, endColumn)
    )
}
