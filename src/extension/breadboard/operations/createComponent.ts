import vscode from 'vscode'

import { CreateComponent } from '../../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

export default function (document: vscode.TextDocument, payload: CreateComponent): vscode.TextEdit {
    const text = document.getText()
    const parsed = parser.parse(document.uri.path, text)
    const objectNode = parser.getObjectNode(parsed)
    if (! objectNode) throw new Error(`ObjectNode not found`)
    const siblingComponentFieldNode = objectNode.fields.last()

    let insertLine = siblingComponentFieldNode.loc.end.line -1
    let insertColumn = siblingComponentFieldNode.loc.end.column -1
    if (',' == document.getText(new vscode.Range(insertLine, insertColumn, insertLine, insertColumn+1))) {
        insertColumn += 1
    }

    let tab = '  ' // two spaces
    let insertText = '\n' + tab + `${ payload.componentIdentifier }: ${ payload.templateImportVariableName } {\n` + tab + '},'

    return vscode.TextEdit.insert(
        new vscode.Position(insertLine, insertColumn),
        insertText
    )
}
