import vscode from 'vscode'

import { CreateRecordValue } from '../../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

export default function (document: vscode.TextDocument, payload: CreateRecordValue): vscode.TextEdit {
    const text = document.getText()
    const parsed = parser.parse(document.uri.path, text)
    const componentObjectNode = parser.getComponentObjectNode(parsed, payload.componentIdentifier)
    const siblingRecordFieldNode = componentObjectNode.fields.last()

    let insertLine = siblingRecordFieldNode.loc.end.line -1
    let insertColumn = siblingRecordFieldNode.loc.end.column -1
    if (['"', '\''].includes(document.getText(new vscode.Range(insertLine, insertColumn, insertLine, insertColumn+1)))) {
        insertColumn += 1
    }
    if (',' == document.getText(new vscode.Range(insertLine, insertColumn, insertLine, insertColumn+1))) {
        insertColumn += 1
    }

    let tab = '  ' // two spaces
    let quot = '\'' // single quot
    let wrappedValue = (typeof payload.recordValue == 'number') ? payload.recordValue.toString() : quot + payload.recordValue + quot
    let insertText = '\n' + tab + tab + `${ payload.recordIdentifier }: ${ wrappedValue }` + ','

    return vscode.TextEdit.insert(
        new vscode.Position(insertLine, insertColumn),
        insertText
    )
}
