import vscode from 'vscode'
import { RequestFindFiles } from '../../TransportPayloads'

export default async function(payload: RequestFindFiles): Promise<string[]> {
    if (! Array.isArray(vscode.workspace.workspaceFolders)) {
        return Promise.resolve([])
    }
    let folder: vscode.WorkspaceFolder = vscode.workspace.workspaceFolders[0]
    return Array.from(
        await vscode.workspace.findFiles(
            new vscode.RelativePattern(folder, payload.pattern),
            payload.exclude,
            500
        )
    ).map((uri: vscode.Uri) => uri.path.replace(folder.uri.path+'/', ''))
}
