import vscode from 'vscode'
import { setup as setupTransport, teardown as teardownTransport, webview } from './transport'

class KickerPanel {
    public static readonly viewType = 'KitchenSink.KickerPanel'
    public static singleton: KickerPanel | undefined

    private readonly panel: vscode.WebviewPanel
    private readonly extensionUri: vscode.Uri
    private disposables: vscode.Disposable[] = []

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this.panel = panel
        this.extensionUri = extensionUri

        this.setWebviewHtml()
        setupTransport(this.panel.webview)
        this.panel.onDidDispose(this.onDidDispose, this, this.disposables)
    }

    static instance(extensionUri: vscode.Uri) {
        if (typeof KickerPanel.singleton == 'undefined') {
            KickerPanel.singleton = new KickerPanel(
                vscode.window.createWebviewPanel(
                    KickerPanel.viewType,
                    'KitchenSink.KickerPanel title',
                    (vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : vscode.ViewColumn.One),
                    {
                        retainContextWhenHidden: true,
                        enableScripts: true,
                        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist')],
                    }
                ),
                extensionUri
            )
        }
        return KickerPanel.singleton
    }

    reveal(): KickerPanel {
        this.panel.reveal(this.panel.viewColumn || vscode.ViewColumn.One)
        return this
    }

    setWebviewHtml() {
        const webviewUri = (uri: string) => this.panel.webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, uri))
        this.panel.webview.html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta content="default-src ${this.panel.webview.cspSource};" http-equiv="Content-Security-Policy">
            <link href="${webviewUri('dist/webview/kicker/kicker.css')}" rel="stylesheet">
            <script defer src="${webviewUri('dist/webview/kicker/kicker.js')}"></script>
        </head><body></body></html>`
    }

    onDidDispose() {
        teardownTransport()
        KickerPanel.singleton = undefined
        this.panel.dispose()
        while (this.disposables.length) {
            this.disposables.pop()?.dispose()
        }
    }

    commandResetListing() {
        webview.resetListing()
    }

    commandTruncateListing() {
        webview.truncateListing(3)
            .then(countRemaining => vscode.window.showInformationMessage(countRemaining.toString()))
    }
}

export default KickerPanel
