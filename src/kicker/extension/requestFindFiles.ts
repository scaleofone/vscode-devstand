import vscode from 'vscode'

export default async function(pattern: string | { pattern:string, exclude?:string }): Promise<string[]> {
    if (! Array.isArray(vscode.workspace.workspaceFolders)) {
        return Promise.resolve([])
    }
    if (typeof pattern == 'string') {
        pattern = { pattern }
    }
    let folder: vscode.WorkspaceFolder = vscode.workspace.workspaceFolders[0]
    return Array.from(
        await vscode.workspace.findFiles(
            new vscode.RelativePattern(folder, pattern.pattern),
            pattern.exclude,
            500
        )
    ).map((uri: vscode.Uri) => uri.path.replace(folder.uri.path+'/', ''))
}
