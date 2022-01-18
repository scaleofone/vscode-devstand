import vscode from 'vscode'
import * as ast from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast'

import { RenameRecord } from '../../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

export default async function (document: vscode.TextDocument, payload: RenameRecord) {
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

    const edit = new vscode.WorkspaceEdit()
    edit.replace(
        document.uri,
        new vscode.Range(
            recordFieldNode.id.loc.begin.line - 1,
            recordFieldNode.id.loc.begin.column - 1,
            recordFieldNode.id.loc.end.line - 1,
            recordFieldNode.id.loc.end.column - 1
        ),
        payload.renameRecordIdentifier
    )
    return vscode.workspace.applyEdit(edit)
}
