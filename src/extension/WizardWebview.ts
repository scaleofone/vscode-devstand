import vscode from 'vscode'

import { window, Disposable, Uri, ViewColumn, WebviewPanel } from 'vscode'

class WizardWebview {
    public static readonly viewType = 'KitchenSink.WizardWebview'
    public static instance: WizardWebview | undefined

    private readonly panel: WebviewPanel
    private readonly extensionUri: Uri
    private disposables: Disposable[] = []

    private constructor(panel: WebviewPanel, extensionUri: Uri) {
        this.panel = panel
        this.extensionUri = extensionUri

        this.redraw()

        this.panel.onDidDispose(this.onDidDispose.bind(this), null, this.disposables)
        this.panel.webview.onDidReceiveMessage(this.onDidReceiveMessage.bind(this), null, this.disposables)
    }

    static instantiateOrReveal(extensionUri: Uri) {
        const viewColumn = window.activeTextEditor ? window.activeTextEditor.viewColumn : undefined

        if (WizardWebview.instance) {
            WizardWebview.instance.panel.reveal(viewColumn)
            return
        }

        WizardWebview.instance = new WizardWebview(
            window.createWebviewPanel(
                WizardWebview.viewType,
                'WizardWebview title',
                viewColumn || ViewColumn.One,
                {
                    retainContextWhenHidden: true,
                    enableScripts: true,
                    localResourceRoots: [Uri.joinPath(extensionUri, 'dist')],
                }
            ),
            extensionUri
        )
    }

    redraw() {
        const webviewUri = (uri: string) => this.panel.webview.asWebviewUri(Uri.joinPath(this.extensionUri, uri))
        this.panel.webview.html = `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta content="default-src ${this.panel.webview.cspSource};" http-equiv="Content-Security-Policy">
                    <link href="${webviewUri('dist/webview/wizard/wizard.css')}" rel="stylesheet">
                    <script defer src="${webviewUri('dist/webview/wizard/wizard.js')}"></script>
                </head>
                <body></body>
            </html>`
    }

    onDidDispose() {
        WizardWebview.instance = undefined

        this.panel.dispose()

        while (this.disposables.length) {
            const x = this.disposables.pop()
            if (x) {
                x.dispose()
            }
        }
    }

    onDidReceiveMessage(message) {
        switch (message.command) {
            case 'info':
                window.showInformationMessage(message.text)
                return
            case 'requestListing':
                this.requestListing(message.directory).then(this.resolveListing.bind(this))
                return
            case 'requestFindFiles':
                this.requestFindFiles(message.pattern).then(this.resolveFindFiles.bind(this))
                return
        }
    }

    resolveListing(listing: Array<string>) {
        this.panel.webview.postMessage({
            command: 'resolveListing',
            listing
        })
    }
    resolveFindFiles(files: Array<string>) {
        this.panel.webview.postMessage({
            command: 'resolveFindFiles',
            files
        })
    }

    async requestListing(directory: string): Promise<Array<string>> {
        if (! Array.isArray(vscode.workspace.workspaceFolders)) {
            return Promise.resolve([])
        }
        let directoryUri = Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, directory.replace(/^\//, ''))
        return Array.from(await vscode.workspace.fs.readDirectory(directoryUri))
            .map(([name, type]) => {
                if (type === vscode.FileType.Directory || type === vscode.FileType.File) {
                    return name + (type === vscode.FileType.Directory ? '/' : '')
                }
            })
            .filter(notempty => notempty)
    }

    async requestFindFiles(pattern: string | { pattern: string, exclude?: string }): Promise<Array<string>> {
        if (! Array.isArray(vscode.workspace.workspaceFolders)) {
            return Promise.resolve([])
        }
        console.log(pattern)
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
        ).map((uri: Uri) => uri.path.replace(folder.uri.path+'/', ''))
    }
}

export default WizardWebview
