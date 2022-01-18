import vscode from 'vscode'
import * as ast from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast'
import { DeleteRecord } from '../../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

export default async function (document: vscode.TextDocument, payload: DeleteRecord) {
    const text = document.getText()
    const parsed = parser.parse(document.uri.path, text)
    const objectNode = parser.getObjectNode(parsed)
    const componentFieldNode = objectNode.fields.find(objectFieldNode => objectFieldNode.id.name == payload.componentIdentifier)
    if (componentFieldNode == undefined) {
        vscode.window.showErrorMessage(`Could not find Component[identifier=${ payload.componentIdentifier }]`)
        return
    }

    if (! (
        componentFieldNode.expr2
        && (ast.isApplyBrace(componentFieldNode.expr2) || (ast.isBinary(componentFieldNode.expr2) && componentFieldNode.expr2.op == 'BopPlus'))
        && ast.isVar(componentFieldNode.expr2.left)
        && ast.isObjectNode(componentFieldNode.expr2.right)
    )) {
        vscode.window.showErrorMessage(`Component[identifier=${ payload.componentIdentifier }] is not a proper component`)
        return
    }
    const componentObjectNode = componentFieldNode.expr2.right

    const recordFieldNode = componentObjectNode.fields.find(recordFieldNode => recordFieldNode.id.name == payload.recordIdentifier)
    if (recordFieldNode == undefined) {
        vscode.window.showErrorMessage(`Could not find Record[identifier=${ payload.recordIdentifier }] within Component[identifier=${ payload.componentIdentifier }]`)
        return
    }
    if (! (
        ast.isLiteralStringSingle(recordFieldNode.expr2)
        || ast.isLiteralStringDouble(recordFieldNode.expr2)
        || ast.isLiteralNumber(recordFieldNode.expr2)
        || ast.isIndex(recordFieldNode.expr2)
    )) {
        vscode.window.showErrorMessage(`node[type=${ recordFieldNode.expr2.type }] is unsupported`)
        return
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
    if (',' == document.getText(new vscode.Range(endLine, endColumn, endLine, endColumn+1))) {
        endColumn += 1
    }
    if ('' == document.getText(new vscode.Range(endLine, endColumn, endLine, endColumn+50)).trim()) {
        // if the rest of the line is whitespace => delete all utill the beginning of the next line
        endLine += 1
        endColumn = 0
    }

    const edit = new vscode.WorkspaceEdit()
    edit.delete(
        document.uri,
        new vscode.Range(
            beginLine,
            beginColumn,
            endLine,
            endColumn,
        )
    )
    return vscode.workspace.applyEdit(edit)
}
