import vscode from 'vscode'

import { KickerWebviewGateway } from './KickerWebviewGateway'

class KickerExtensionFacade {
    private gateway: KickerWebviewGateway
    constructor(gateway: KickerWebviewGateway) {
        this.gateway = gateway
    }

    /************** Handle commands passed from extension **************/

    showMessage(payload: string) {
        vscode.window.showInformationMessage(payload)
    }

    async requestListing(directory: string): Promise<string[]> {
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

    async requestFindFiles(pattern: string | { pattern:string, exclude?:string }): Promise<string[]> {
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

    async saveSnippets() {
        const filesToSave = await this.gateway.getFilesToSave()
        filesToSave.forEach(filename => {
            this.gateway.getFileContent(filename)
                .then(content => this.saveFile(filename, content))
        })
    }

    private saveFile(filename: string, content: string) {
        vscode.window.showInformationMessage(filename)
    }
}

export { KickerExtensionFacade }
