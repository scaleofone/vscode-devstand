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
        }
    }
}

export default WizardWebview
