import vscode from 'vscode'

import { window, Disposable, Uri, ViewColumn, WebviewPanel } from 'vscode'

class WizardWebview {
    public static readonly viewType = 'KitchenSink.WizardWebview'
    public static instance: WizardWebview | undefined

    private requestIdSequence: number = 1
    private readonly panel: WebviewPanel
    private readonly extensionUri: Uri
    private disposables: Disposable[] = []

    private constructor(panel: WebviewPanel, extensionUri: Uri) {
        this.panel = panel
        this.extensionUri = extensionUri

        this.redraw()

        this.panel.onDidDispose(this.onDidDispose.bind(this), null, this.disposables)
        this.panel.webview.onDidReceiveMessage(this.onDidReceiveMessage, this, this.disposables)
    }

    static instantiateOrReveal(extensionUri: Uri, title: string) {
        const viewColumn = window.activeTextEditor ? window.activeTextEditor.viewColumn : undefined

        if (WizardWebview.instance) {
            WizardWebview.instance.panel.reveal(viewColumn)
            return
        }

        WizardWebview.instance = new WizardWebview(
            window.createWebviewPanel(
                WizardWebview.viewType,
                title,
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
        const basename = this.panel.title // TODO dirty hack
        this.panel.webview.html = `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta content="default-src ${this.panel.webview.cspSource};" http-equiv="Content-Security-Policy">
                    <link href="${webviewUri('dist/webview/'+basename+'/'+basename+'.css')}" rel="stylesheet">
                    <script defer src="${webviewUri('dist/webview/'+basename+'/'+basename+'.js')}"></script>
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
        if (message.__is == 'void' && message.__from === 'webview') {
            this[message.command].apply(this, [message.payload])
        } else if (message.__is == 'request' && message.__from === 'webview') {
            this[message.command].apply(this, [message.payload])
                .then(responsePayload => {
                    this.panel.webview.postMessage({
                        __is: 'response',
                        __from: 'domain',
                        __requestId: message.__requestId,
                        payload: responsePayload
                    })
                })
        }
    }

    postVoidPayload(command, payload) {
        this.panel.webview.postMessage({ __is: 'void', __from: 'domain', command, payload })
    }

    async postRequestPayload(command, payload) : Promise<unknown> {
        return new Promise((resolve, reject) => {
            let __requestId = ++this.requestIdSequence
            let disposable = this.panel.webview.onDidReceiveMessage((message) => {
                if (message.__requestId === __requestId && message.__is === 'response' && message.__from === 'webview') {
                    let givenDisposableIndex = this.disposables.findIndex(given => given === disposable)
                    if (givenDisposableIndex > -1) {
                        this.disposables[givenDisposableIndex].dispose()
                        this.disposables.splice(givenDisposableIndex, 1)
                    }
                    resolve(message.payload)
                }
            }, this, this.disposables)
            this.panel.webview.postMessage({ __is: 'request', __from: 'domain', command, payload, __requestId })
        })
    }


    /************** Handle commands passed from webview **************/

    showMessage(payload: string) {
        window.showInformationMessage(payload)
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

    async saveSnippets() {
        const filesToSave = await this.postRequestPayload('getFilesToSave', null)
        if (Array.isArray(filesToSave)) {
            filesToSave.forEach(filename => {
                this.postRequestPayload('getFileContent', filename)
                    .then(content => this.saveFile(filename, content))
            })
        }
    }

    saveFile(filename : string, content) {
        this.showMessage(filename)
    }

    /************** Pass commands to webview **************/

    resetListing() {
        this.postVoidPayload('resetListing', null)
    }
    truncateListing() {
        this.postRequestPayload('truncateListing', 3)
            .then(responsePayload => this.showMessage(responsePayload.toString()))
    }
}

export default WizardWebview
