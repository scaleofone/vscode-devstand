import vscode from 'vscode'
import { setup as setupTransport, teardown as teardownTransport, webview } from './transport'

class EditorPanel {
    public static readonly viewType = 'KitchenSink.EditorPanel'
    public static singleton: EditorPanel | undefined

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
        if (typeof EditorPanel.singleton == 'undefined') {
            EditorPanel.singleton = new EditorPanel(
                vscode.window.createWebviewPanel(
                    EditorPanel.viewType,
                    'KitchenSink.EditorPanel title',
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
        return EditorPanel.singleton
    }

    reveal(): EditorPanel {
        this.panel.reveal(this.panel.viewColumn || vscode.ViewColumn.One)
        return this
    }

    setWebviewHtml() {
        const webviewUri = (uri: string) => this.panel.webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, uri))
        this.panel.webview.html = [
            '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">',
                '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
                '<meta content="default-src ', this.panel.webview.cspSource, ';" http-equiv="Content-Security-Policy">',
                '<link rel="stylesheet" href="', webviewUri('dist/webview/editor/editor.css'), '">',
                '<script defer src="', webviewUri('dist/webview/editor/editor.js'), '"></script>',
            '</head><body></body></html>',
        ].join('')
    }

    onDidDispose() {
        teardownTransport()
        EditorPanel.singleton = undefined
        this.panel.dispose()
        while (this.disposables.length) {
            this.disposables.pop()?.dispose()
        }
    }

    commandRecenter() {
        webview.recenter()
    }

    commandGetTopLeft() {
        webview.getTopLeft()
            .then(([top, left]) => {
                vscode.window.showInformationMessage(`Inside extension: top=${top}, left=${left}`)
            })
    }
}

export default EditorPanel
