import vscode from 'vscode'
import { webview } from './transport'

function saveFile(filename: string, content: string) {
    vscode.window.showInformationMessage(filename)
}

export default async function() {
    const filesToSave = await webview.getFilesToSave()
    filesToSave.forEach(filename => {
        webview.getFileContent(filename)
            .then(content => saveFile(filename, content))
    })
}
