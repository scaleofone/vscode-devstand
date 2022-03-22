import vscode from 'vscode'
import * as ast from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast'

import { CreateRecordValue } from '../../../TransportPayloads'
import { editableStringToConcatenationString, isEditableString } from '../jsonnet/helpers'

import * as parser from '../jsonnet/JsonnetParser'

function addOffsetAndStripQuotes(str: string, tabsOffset: string): string {
    return str.replace(/^(\s{1,})(")([^"]{1,})(")(\:)(.*)$/gm, tabsOffset + '$1$3$5$6').replace(/^(\s*)(})(.*)$/gm, tabsOffset + '$1$2')
}

export default function (document: vscode.TextDocument, payload: CreateRecordValue): vscode.TextEdit {
    const text = document.getText()
    const parsed = parser.parse(document.uri.path, text)
    const componentObjectNode = parser.getComponentObjectNode(parsed, payload.componentIdentifier)

    function getInsertPosition() {
        let insertLine: number
        let insertColumn: number
        let tabsOffsetSize = 2

        let scopeObjectNode = componentObjectNode

        if (payload.recordScope) {
            let scopeFieldNode = componentObjectNode.fields.find(f => f.id.name == payload.recordScope)
            if (scopeFieldNode && scopeFieldNode.expr2 && ast.isObjectNode(scopeFieldNode.expr2)) {
                scopeObjectNode = scopeFieldNode.expr2
                tabsOffsetSize = 3
            } else if (scopeFieldNode && scopeFieldNode.expr2 && (
                (ast.isApplyBrace(scopeFieldNode.expr2) || (ast.isBinary(scopeFieldNode.expr2) && scopeFieldNode.expr2.op == 'BopPlus'))
                && ast.isObjectNode(scopeFieldNode.expr2.right)
            )) {
                scopeObjectNode = scopeFieldNode.expr2.right
                tabsOffsetSize = 3
            }
        }

        const siblingRecordFieldNode = (payload.belowRecordIdentifier ? scopeObjectNode.fields.find(f => f.id.name == payload.belowRecordIdentifier) : undefined) || scopeObjectNode.fields.last()

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
            insertLine = scopeObjectNode.loc.begin.line -1
            insertColumn = scopeObjectNode.loc.begin.column -1
            insertColumn += document.getText(new vscode.Range(insertLine, insertColumn, insertLine, insertColumn+100)).length
        }
        return { insertLine, insertColumn, tabsOffsetSize }
    }

    let { insertLine, insertColumn, tabsOffsetSize } = getInsertPosition()

    let tab = '  ' // two spaces
    let quot = '\'' // single quot

    function stringifiedValue(payload: CreateRecordValue): string {
        if (payload.recordType == 'null') {
            return 'null'
        } else if (payload.recordType == 'object') {
            try {
                if (typeof payload.recordValue == 'object' && payload.recordValue !== null) {
                    return addOffsetAndStripQuotes(JSON.stringify(payload.recordValue, null, tab), tab.repeat(tabsOffsetSize))
                } else {
                    return '{}'
                }
            } catch (err) {
                return '{}'
            }
        } else if (payload.recordType == 'number' && typeof payload.recordValue == 'number') {
            return payload.recordValue.toString()
        } else if (payload.recordType == 'string' && ['number', 'string'].includes(typeof payload.recordValue)) {

            if (typeof payload.recordValue == 'string' && isEditableString(payload.recordValue)) {
                let stringifiedValue = editableStringToConcatenationString(payload.recordValue)
                console.log('isConcatenationString', stringifiedValue)
                return stringifiedValue
            }

            return quot + payload.recordValue.toString() + quot
        }
        return 'null'
    }

    let insertText = '\n' + tab.repeat(tabsOffsetSize) + `${ payload.recordIdentifier }: ${ stringifiedValue(payload) }` + ','

    return vscode.TextEdit.insert(
        new vscode.Position(insertLine, insertColumn),
        insertText
    )
}
