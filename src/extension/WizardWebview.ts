import vscode from 'vscode'

import { window, Disposable, Uri, ViewColumn, WebviewPanel } from 'vscode'

import { KickerExtensionContext } from './KickerExtensionContext'

class WizardWebview {
    public static readonly viewType = 'KitchenSink.WizardWebview'
    public static instance: WizardWebview | undefined

    private readonly panel: WebviewPanel
    private readonly extensionUri: Uri
    private disposables: Disposable[] = []

    private context: KickerExtensionContext

    private constructor(panel: WebviewPanel, extensionUri: Uri) {
        this.panel = panel
        this.extensionUri = extensionUri

        this.redraw()

        this.panel.onDidDispose(this.onDidDispose, this, this.disposables)

        this.context = new KickerExtensionContext(this.panel.webview, this.disposables)
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

    /************** handle commands from command palette **************/

    resetListing() {
        this.context.gateway.resetListing()
    }
    truncateListing() {
        this.context.gateway.truncateListing(3)
            .then(countRemaining => vscode.window.showInformationMessage(countRemaining.toString()))
    }
}

export default WizardWebview
