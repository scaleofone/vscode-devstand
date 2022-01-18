import vscode from 'vscode'
import * as ast from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast'

import { CreateRecordValue } from '../../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

export default async function (document: vscode.TextDocument, payload: CreateRecordValue) {
    const text = document.getText()
    const parsed = parser.parse(document.uri.path, text)
    const componentObjectNode = parser.getComponentObjectNode(parsed, payload.componentIdentifier)
    const recordFieldNode = componentObjectNode.fields.last()

    let insertLine = recordFieldNode.loc.end.line -1
    let insertColumn = recordFieldNode.loc.end.column -1
    if (['"', '\''].includes(document.getText(new vscode.Range(insertLine, insertColumn, insertLine, insertColumn+1)))) {
        insertColumn += 1
    }
    if (',' == document.getText(new vscode.Range(insertLine, insertColumn, insertLine, insertColumn+1))) {
        insertColumn += 1
    }

    let indent = '  ' // two spaces
    let quot = '\'' // single quot
    let wrappedValue = (typeof payload.recordValue == 'number') ? payload.recordValue.toString() : quot + payload.recordValue + quot
    let insertText = '\n' + indent + indent + `${ payload.recordIdentifier }: ${ wrappedValue }` + ','

    const edit = new vscode.WorkspaceEdit()
    edit.insert(
        document.uri,
        new vscode.Position(
            insertLine,
            insertColumn
        ),
        insertText
    )
    return vscode.workspace.applyEdit(edit)
}
