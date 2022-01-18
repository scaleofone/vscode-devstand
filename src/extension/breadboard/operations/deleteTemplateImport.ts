import vscode from 'vscode'
import * as ast from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast'
import { DeleteTemplateImport } from '../../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

export default async function (document: vscode.TextDocument, payload: DeleteTemplateImport) {
    const text = document.getText()
    const parsed = parser.parse(document.uri.path, text)
    const localBindNodes = parser.getLocalBindNodes(parsed)
    const nodeToRemove = localBindNodes.find(node => ast.isIndex(node.body) && ast.isImport(node.body.target) && node.variable.name == payload.variableName)
    if (nodeToRemove == undefined) {
        vscode.window.showErrorMessage('Can not find LocalBindNode[variable.name]='+payload.variableName)
        return
    }

    let endLine = nodeToRemove.loc.end.line -1
    let endColumn = nodeToRemove.loc.end.column -1
    if (';' == document.getText(new vscode.Range(endLine, endColumn, endLine, endColumn+1))) {
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
            nodeToRemove.loc.begin.line -1,
            nodeToRemove.loc.begin.column -1,
            endLine,
            endColumn
        )
    )
    return vscode.workspace.applyEdit(edit)
}
