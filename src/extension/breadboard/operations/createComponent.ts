import vscode from 'vscode'

import { CreateComponent, NewComponentGeometry } from '../../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

export default function (document: vscode.TextDocument, payload: CreateComponent, geometry?: NewComponentGeometry): vscode.TextEdit {
    const parsed = parser.parse(document.uri.path, document.getText())
    const objectNode = parser.getObjectNode(parsed)
    if (! objectNode) throw new Error(`ObjectNode not found`)
    const siblingComponentFieldNode = objectNode.fields.findLast(field => field.id.name != 'meta')

    let insertLine: number
    let insertColumn: number

    let replaceRange: vscode.Range

    if (siblingComponentFieldNode) {
        insertLine = siblingComponentFieldNode.loc.end.line -1
        insertColumn = siblingComponentFieldNode.loc.end.column -1
        if (',' == document.getText(new vscode.Range(insertLine, insertColumn, insertLine, insertColumn+1))) {
            insertColumn += 1
        }
    } else {
        replaceRange = new vscode.Range(
            objectNode.loc.begin.line -1,
            objectNode.loc.begin.column -1,
            objectNode.loc.end.line -1,
            objectNode.loc.end.column -1
        )
    }

    let tab = '  ' // two spaces
    let insertText = '\n' + tab + `${ payload.componentIdentifier }: ${ payload.templateImportVariableName } {\n` + tab + '},'

    if (typeof geometry == 'undefined') {
        geometry = {
            cornerY: 100,
            cornerX: 100,
            colorIndex: 0,
        }
    }

    if (typeof replaceRange != 'undefined') {
        let insertMetaText = '\n' + tab + `meta:: '{"geometry":{"${ payload.componentIdentifier }":[${ geometry.cornerY },${ geometry.cornerX },${ geometry.colorIndex }]}}',`
        return vscode.TextEdit.replace(
            replaceRange,
            '{' + insertText + insertMetaText + '\n}'
        )
    }

    return vscode.TextEdit.insert(
        new vscode.Position(insertLine, insertColumn),
        insertText
    )
}
