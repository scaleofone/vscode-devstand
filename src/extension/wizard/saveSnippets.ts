import vscode from 'vscode'
import { webview } from './transport'

export default async function() {
    const filesToSave = await webview.getFilesToSave()

    let directory = await vscode.window.showQuickPick(['/', '/docker', '/container'], { title: 'Select directory' })

    let directoryUri = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, directory.replace(/^\//, ''))
    await vscode.workspace.fs.createDirectory(directoryUri)

    let countDeleted = 0
    if (directory != '/') {
        for (const [filename] of await vscode.workspace.fs.readDirectory(directoryUri)) {
            if (! filesToSave.includes(filename)) {
                await vscode.workspace.fs.delete(vscode.Uri.joinPath(directoryUri, filename))
                countDeleted++
            }
        }
    }

    for (const filename of filesToSave) {
        vscode.workspace.fs.writeFile(
            vscode.Uri.joinPath(directoryUri, filename),
            await webview.getFileContent(filename)
                .then(content => (new TextEncoder().encode(content)))
        )
    }

    vscode.window.showInformationMessage(`Saved ${filesToSave.length} files and Deleted ${countDeleted} files in ${directory} directory`)
}
