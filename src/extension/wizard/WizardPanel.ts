import vscode from 'vscode'

import { WizardExtensionContext } from './WizardExtensionContext'

class WizardPanel {
    public static readonly viewType = 'KitchenSink.WizardPanel'
    public static instance: WizardPanel | undefined

    private readonly panel: vscode.WebviewPanel
    private readonly extensionUri: vscode.Uri
    private disposables: vscode.Disposable[] = []

    private context: WizardExtensionContext

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this.panel = panel
        this.extensionUri = extensionUri

        this.redraw()

        this.panel.onDidDispose(this.onDidDispose, this, this.disposables)

        this.context = new WizardExtensionContext(this.panel.webview, this.disposables)
    }

    static instantiateOrReveal(extensionUri: vscode.Uri) {
        const viewColumn = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined
        if (WizardPanel.instance) {
            WizardPanel.instance.panel.reveal(viewColumn)
        } else {
            WizardPanel.instance = new WizardPanel(
                vscode.window.createWebviewPanel(
                    WizardPanel.viewType,
                    'KitchenSink.WizardPanel title',
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
        // TODO this.context.dispose()

        WizardPanel.instance = undefined

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
