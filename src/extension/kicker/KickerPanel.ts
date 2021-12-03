import vscode from 'vscode'

import { KickerExtensionContext } from './KickerExtensionContext'

class KickerPanel {
    public static readonly viewType = 'KitchenSink.KickerPanel'
    public static instance: KickerPanel | undefined

    private readonly panel: vscode.WebviewPanel
    private readonly extensionUri: vscode.Uri
    private disposables: vscode.Disposable[] = []

    private context: KickerExtensionContext

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this.panel = panel
        this.extensionUri = extensionUri

        this.redraw()

        this.panel.onDidDispose(this.onDidDispose, this, this.disposables)

        this.context = new KickerExtensionContext(this.panel.webview, this.disposables)
    }

    static instantiateOrReveal(extensionUri: vscode.Uri) {
        const viewColumn = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined

        if (KickerPanel.instance) {
            KickerPanel.instance.panel.reveal(viewColumn)
            return
        }

        KickerPanel.instance = new KickerPanel(
            vscode.window.createWebviewPanel(
                KickerPanel.viewType,
                'KitchenSink.KickerPanel title',
                viewColumn || vscode.ViewColumn.One,
                {
                    retainContextWhenHidden: true,
                    enableScripts: true,
                    localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist')],
                }
            ),
            extensionUri
        )
    }

    redraw() {
        const webviewUri = (uri: string) => this.panel.webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, uri))
        const basename = 'kicker'
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
        // PERF this.context.dispose()

        KickerPanel.instance = undefined

        this.panel.dispose()

        while (this.disposables.length) {
            const x = this.disposables.pop()
            if (x) {
                x.dispose()
            }
        }
    }

    // TODO not related to the class
    resetListing() {
        this.context.gateway.resetListing()
    }
    // TODO not related to the class
    truncateListing() {
        this.context.gateway.truncateListing(3)
            .then(countRemaining => vscode.window.showInformationMessage(countRemaining.toString()))
    }
}

export default KickerPanel
