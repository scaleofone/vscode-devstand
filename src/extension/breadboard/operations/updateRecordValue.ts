import vscode from 'vscode'
import * as ast from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast'

import { UpdateRecordValue } from '../../../TransportPayloads'
import { editableStringToConcatenationString, isEditableString } from '../jsonnet/helpers'

import * as parser from '../jsonnet/JsonnetParser'

export default function (document: vscode.TextDocument, payload: UpdateRecordValue): vscode.TextEdit {
    const text = document.getText()
    const parsed = parser.parse(document.uri.path, text)
    const recordFieldNode = parser.getRecordFieldNode(parsed, payload.componentIdentifier, payload.recordIdentifier, payload.recordScope)
    const targetNode = recordFieldNode.expr2

    if (! (
        ast.isLiteralStringSingle(targetNode)
        || ast.isLiteralStringDouble(targetNode)
        || ast.isLiteralNumber(targetNode)
        || ast.isLiteralNull(targetNode)
        || ast.isBinary(targetNode)
        || ast.isIndex(targetNode)
    )) {
        vscode.window.showErrorMessage(`node[type=${ targetNode.type }] is not supported`)
        return
    }

    let beginLine = targetNode.loc.begin.line - 1
    let beginColumn = targetNode.loc.begin.column - 1
    let endLine = targetNode.loc.end.line - 1
    let endColumn = targetNode.loc.end.column - 1

    let isConcatenationString = false
    if (typeof payload.updateRecordValue == 'string' && isEditableString(payload.updateRecordValue)) {
        isConcatenationString = true
        payload.updateRecordValue = editableStringToConcatenationString(payload.updateRecordValue)
        console.log('isConcatenationString', payload.updateRecordValue)
    }

    let insertText = (payload.updateRecordValue === null) ? 'null' : payload.updateRecordValue.toString()
    let quot = '\'' // single quot

    const targetNodeHasQuotes = ast.isLiteralStringSingle(targetNode) || ast.isLiteralStringDouble(targetNode) || ast.isBinary(targetNode)
    const insertTextRequiresQuotes = isConcatenationString ? false : ! (typeof payload.updateRecordValue == 'number' || payload.updateRecordValue === null)
    if (targetNodeHasQuotes && ! insertTextRequiresQuotes) {
        beginColumn -= 1
        endColumn += 1
    } else if (! targetNodeHasQuotes && insertTextRequiresQuotes) {
        insertText = quot + insertText + quot
    }

    if ('' == document.getText(new vscode.Range(beginLine, endColumn, beginLine, endColumn+1))) {
        endColumn += 1
        insertText += ','
    }
    if (':' != document.getText(new vscode.Range(beginLine, beginColumn-1, beginLine, beginColumn-2))) {
        insertText = ' '+insertText
    }

    return vscode.TextEdit.replace(
        new vscode.Range(beginLine, beginColumn, endLine, endColumn),
        insertText
    )
}
