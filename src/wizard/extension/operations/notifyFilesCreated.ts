import vscode from 'vscode'
import { NotifyFilesCreated } from '../../TransportPayloads'

export default async function(payload: NotifyFilesCreated): Promise<void> {

    if (payload.filesToOpenOnClick.length == 0) {
        vscode.window.showInformationMessage(payload.message)
        return
    }

    if (! Array.isArray(vscode.workspace.workspaceFolders)) {
        throw new Error('No folders open in the workspace')
    }
    let workspaceFolder: vscode.WorkspaceFolder = vscode.workspace.workspaceFolders[0]

    let urisToOpen: vscode.Uri[] = payload.filesToOpenOnClick.map(_payload => {
        return _payload.dirname
            ? vscode.Uri.joinPath(workspaceFolder.uri, _payload.dirname, _payload.basename)
            : vscode.Uri.joinPath(workspaceFolder.uri, _payload.basename)
    })

    let openFileCaption = payload.filesToOpenOnClick.length == 1 ? 'View file' : 'View files'

    vscode.window.showInformationMessage(payload.message, openFileCaption)
        .then(clickedCaption => {
            if (clickedCaption == openFileCaption) {
                for (let uri of urisToOpen) {
                    vscode.window.showTextDocument(uri, {
                        preserveFocus: false,
                        preview: false,
                        viewColumn: vscode.ViewColumn.Seven,
                    })
                }
            }
        })
}
