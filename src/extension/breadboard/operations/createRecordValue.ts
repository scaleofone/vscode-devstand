import vscode from 'vscode'

import { CreateRecordValue } from '../../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

function addOffsetAndStripQuotes(str: string, tabsOffset: string): string {
    return str.replace(/^(\s{1,})(")([^"]{1,})(")(\:)(.*)$/gm, tabsOffset + '$1$3$5$6').replace(/^(\s*)(})(.*)$/gm, tabsOffset + '$1$2')
}

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

    function stringifiedValue(payload: CreateRecordValue): string {
        if (payload.recordType == 'null') {
            return 'null'
        } else if (payload.recordType == 'object') {
            try {
                if (typeof payload.recordValue == 'object' && payload.recordValue !== null) {
                    return addOffsetAndStripQuotes(JSON.stringify(payload.recordValue, null, tab), tab.repeat(2))
                } else {
                    return '{}'
                }
            } catch (err) {
                return '{}'
            }
        } else if (payload.recordType == 'number' && typeof payload.recordValue == 'number') {
            return payload.recordValue.toString()
        } else if (payload.recordType == 'string' && ['number', 'string'].includes(typeof payload.recordValue)) {
            return quot + payload.recordValue.toString() + quot
        }
        return 'null'
    }

    let insertText = '\n' + tab.repeat(2) + `${ payload.recordIdentifier }: ${ stringifiedValue(payload) }` + ','

    return vscode.TextEdit.insert(
        new vscode.Position(insertLine, insertColumn),
        insertText
    )
}
