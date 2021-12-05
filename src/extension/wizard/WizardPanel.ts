import vscode from 'vscode'
import { setup as setupTransport, teardown as teardownTransport, webview } from './transport'

class WizardPanel {
    public static readonly viewType = 'KitchenSink.WizardPanel'
    public static singleton: WizardPanel | undefined

    private readonly panel: vscode.WebviewPanel
    private readonly extensionUri: vscode.Uri
    private disposables: vscode.Disposable[] = []

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this.panel = panel
        this.extensionUri = extensionUri

        this.redraw()

        this.panel.onDidDispose(this.onDidDispose, this, this.disposables)

        setupTransport(this.panel.webview)
    }

    static instance(extensionUri: vscode.Uri) {
        if (typeof WizardPanel.singleton == 'undefined') {
            WizardPanel.singleton = new WizardPanel(
                vscode.window.createWebviewPanel(
                    WizardPanel.viewType,
                    'KitchenSink.WizardPanel title',
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
        return WizardPanel.singleton
    }

    reveal(): WizardPanel {
        this.panel.reveal(this.panel.viewColumn || vscode.ViewColumn.One)
        return this
    }

    redraw() {
        const webviewUri = (uri: string) => this.panel.webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, uri))
        const basename = 'wizard'
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
        teardownTransport()

        WizardPanel.singleton = undefined

        this.panel.dispose()

        while (this.disposables.length) {
            const x = this.disposables.pop()
            if (x) {
                x.dispose()
            }
        }
    }
}

export default WizardPanel
