import vscode from 'vscode'

export default async function(document: vscode.TextDocument, topleft: number[]) {
    const textContent = JSON.stringify({
        top: topleft[0],
        left: topleft[1]
    }, null, 2)

    const edit = new vscode.WorkspaceEdit()
    edit.replace(
        document.uri,
        new vscode.Range(0, 0, document.lineCount, 0),
        textContent
    )
    return vscode.workspace.applyEdit(edit)
}
