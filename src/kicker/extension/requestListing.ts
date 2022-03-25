import vscode from 'vscode'

export default async function(directory: string): Promise<string[]> {
    if (! Array.isArray(vscode.workspace.workspaceFolders)) {
        return Promise.resolve([])
    }
    let directoryUri = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, directory.replace(/^\//, ''))
    return Array.from(await vscode.workspace.fs.readDirectory(directoryUri))
        .map(([name, type]) => {
            if (type === vscode.FileType.Directory || type === vscode.FileType.File) {
                return name + (type === vscode.FileType.Directory ? '/' : '')
            }
        })
        .filter(notempty => notempty)
}
