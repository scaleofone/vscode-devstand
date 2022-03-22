import vscode from 'vscode'
import * as ast from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast'
import { DeleteRecord } from '../../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

export default function (document: vscode.TextDocument, payload: DeleteRecord): vscode.TextEdit {
    const text = document.getText()
    const parsed = parser.parse(document.uri.path, text)
    const recordFieldNode = parser.getRecordFieldNode(parsed, payload.componentIdentifier, payload.recordIdentifier, payload.recordScope)

    if (! (
        ast.isLiteralStringSingle(recordFieldNode.expr2)
        || ast.isLiteralStringDouble(recordFieldNode.expr2)
        || ast.isLiteralNumber(recordFieldNode.expr2)
        || ast.isIndex(recordFieldNode.expr2)
        || ast.isLiteralNull(recordFieldNode.expr2)
        || ast.isBinary(recordFieldNode.expr2)
        || ast.isObjectNode(recordFieldNode.expr2)
    )) {
        throw new Error(`node[type=${ recordFieldNode.expr2.type }] is not supported`)
    }

    let beginLine = recordFieldNode.loc.begin.line -1
    let beginColumn = recordFieldNode.loc.begin.column -1
    if ('' == document.getText(new vscode.Range(beginLine, 0, beginLine, beginColumn)).trim()) {
        // if the start of the line is whitespace => delete starting at the beginning of the line
        beginColumn = 0
    }
    let endLine = recordFieldNode.loc.end.line -1
    let endColumn = recordFieldNode.loc.end.column -1
    if (ast.isLiteralStringSingle(recordFieldNode.expr2) || ast.isLiteralStringDouble(recordFieldNode.expr2)) {
        endColumn += 1 // single quot || double quot
    }
    if (ast.isBinary(recordFieldNode.expr2) && (
        `'` == document.getText(new vscode.Range(endLine, endColumn, endLine, endColumn+1))
        || `"` == document.getText(new vscode.Range(endLine, endColumn, endLine, endColumn+1))
    )) {
        endColumn += 1 // single quot || double quot
    }

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
