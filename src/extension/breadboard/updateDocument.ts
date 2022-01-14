import vscode from 'vscode'
import { Breadboard, convertToFile } from './jsonnet/BreadboardTypes'

export default async function(document: vscode.TextDocument, breadboard: Breadboard) {
    const textContent = convertToFile(breadboard)

    const edit = new vscode.WorkspaceEdit()
    edit.replace(
        document.uri,
        new vscode.Range(0, 0, document.lineCount, 0),
        textContent
    )
    return vscode.workspace.applyEdit(edit)
}
