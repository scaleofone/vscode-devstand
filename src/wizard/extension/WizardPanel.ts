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

        this.panel.webview.html = this.getHtmlForWebview(this.panel.webview)
        setupTransport(this.panel.webview)
        this.panel.onDidDispose(this.onDidDispose, this, this.disposables)
    }

    static instance(extensionUri: vscode.Uri) {
        if (typeof WizardPanel.singleton == 'undefined') {
            WizardPanel.singleton = new WizardPanel(
                vscode.window.createWebviewPanel(
                    WizardPanel.viewType,
                    'Dockerfile wizard',
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

    setOpenedFromFolder(folderFromContextMenu: vscode.Uri): WizardPanel {
        let folder = vscode.workspace.workspaceFolders[0]
        webview.setOpenedFromFolder({
            path: folderFromContextMenu.path,
            workspaceFolderPath: folder.uri.path,
        })
        return this
    }

    private getHtmlForWebview(webview: vscode.Webview): string {
        const cspHeader = `default-src 'self' ${webview.cspSource}; `
                        + `style-src 'self' 'unsafe-inline' ${webview.cspSource}; `
                        + `img-src 'self' data: ${webview.cspSource}; `
        const styleHref = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'dist/webview/wizard/webview/wizard.css'))
        const scriptHref = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'dist/webview/wizard/webview/wizard.js'))
        return [
            '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">',
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
                `<meta content="${cspHeader}" http-equiv="Content-Security-Policy">`,
                `<link href="${styleHref}" rel="stylesheet">`,
                `<script defer src="${scriptHref}"></script>`,
            '</head><body></body></html>',
        ].join('')
    }

    onDidDispose() {
        teardownTransport()
        WizardPanel.singleton = undefined
        this.panel.dispose()
        while (this.disposables.length) {
            this.disposables.pop()?.dispose()
        }
    }
}

export default WizardPanel
