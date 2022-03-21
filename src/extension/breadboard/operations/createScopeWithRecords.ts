import vscode from 'vscode'
import * as ast from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast'

import { CreateScopeWithRecords } from '../../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

function addOffsetAndStripQuotes(str: string, tabsOffset: string): string {
    return str.replace(/^(\s{1,})(")([^"]{1,})(")(\:)(.*)$/gm, tabsOffset + '$1$3$5$6').replace(/^(\s*)(})(.*)$/gm, tabsOffset + '$1$2')
}

export default function (document: vscode.TextDocument, payload: CreateScopeWithRecords): vscode.TextEdit {
    const text = document.getText()
    const parsed = parser.parse(document.uri.path, text)
    const componentObjectNode = parser.getComponentObjectNode(parsed, payload.componentIdentifier)

    function getInsertPosition() {
        let insertLine: number
        let insertColumn: number

        const siblingRecordFieldNode = componentObjectNode.fields.last()

        if (siblingRecordFieldNode) {
            insertLine = siblingRecordFieldNode.loc.end.line -1
            insertColumn = siblingRecordFieldNode.loc.end.column -1
            if (['"', '\''].includes(document.getText(new vscode.Range(insertLine, insertColumn, insertLine, insertColumn+1)))) {
                insertColumn += 1
            }
            if (',' == document.getText(new vscode.Range(insertLine, insertColumn, insertLine, insertColumn+1))) {
                insertColumn += 1
            }
        } else {
            insertLine = componentObjectNode.loc.begin.line -1
            insertColumn = componentObjectNode.loc.begin.column -1
            insertColumn += document.getText(new vscode.Range(insertLine, insertColumn, insertLine, insertColumn+100)).length
        }
        return { insertLine, insertColumn }
    }

    let { insertLine, insertColumn } = getInsertPosition()

    let tab = '  ' // two spaces
    let quot = '\'' // single quot

    function stringifiedValue(recordType: string, recordValue: any): string {
        if (recordType == 'null') {
            return 'null'
        } else if (recordType == 'object') {
            try {
                if (typeof recordValue == 'object' && recordValue !== null) {
                    return addOffsetAndStripQuotes(JSON.stringify(recordValue, null, tab), tab.repeat(3))
                } else {
                    return '{}'
                }
            } catch (err) {
                return '{}'
            }
        } else if (recordType == 'number' && typeof recordValue == 'number') {
            return recordValue.toString()
        } else if (recordType == 'string' && ['number', 'string'].includes(typeof recordValue)) {
            return quot + recordValue.toString() + quot
        }
        return 'null'
    }

    let insertText = '\n' + tab.repeat(2) + `${ payload.scopeIdentifier }: {`
    for (let rec of payload.records) {
        insertText += '\n' + tab.repeat(3) + `${ rec.identifier }: ${ stringifiedValue(rec.type, rec.value) }` + ','
    }
    insertText += '\n' + tab.repeat(2) + `},`

    return vscode.TextEdit.insert(
        new vscode.Position(insertLine, insertColumn),
        insertText
    )
}
