import vscode from 'vscode'
import { CreateFile } from '../../TransportPayloads'

export default async function(payload: CreateFile[]): Promise<void> {
    if (! Array.isArray(vscode.workspace.workspaceFolders)) {
        throw new Error('No folders open in the workspace')
    }
    let workspaceFolder: vscode.WorkspaceFolder = vscode.workspace.workspaceFolders[0]

    for (let _payload of payload) {
        let path = _payload.dirname ? vscode.Uri.joinPath(workspaceFolder.uri, _payload.dirname, _payload.basename) : vscode.Uri.joinPath(workspaceFolder.uri, _payload.basename)
        vscode.workspace.fs.writeFile(
            path,
            (new TextEncoder().encode(_payload.contents || ''))
        )
    }
}
