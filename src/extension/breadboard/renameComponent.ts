import vscode from 'vscode'

import * as parser from './jsonnet/JsonnetParser'

export interface IRenameComponentPayload {
    before: string,
    after: string,
}

export async function renameComponent(document: vscode.TextDocument, payload: IRenameComponentPayload) {
    const text = document.getText()
    const ast = parser.parseAst(document.uri.path, text)
    if (! ast.type) throw new Error('ast[type] attr is missing')
    const objectNode = parser.getObjectNode(ast)
    const objectFieldNode = objectNode.fields.find(objectFieldNode => objectFieldNode.id.name == payload.before)
    if (objectFieldNode == undefined) {
        vscode.window.showErrorMessage(`Could not find Component[identifier=${ payload.before }]`)
        return
    }

    const edit = new vscode.WorkspaceEdit()
    edit.replace(
        document.uri,
        new vscode.Range(
            objectFieldNode.id.loc.begin.line - 1,
            objectFieldNode.id.loc.begin.column - 1,
            objectFieldNode.id.loc.end.line - 1,
            objectFieldNode.id.loc.end.column - 1
        ),
        payload.after
    )
    return vscode.workspace.applyEdit(edit)
}