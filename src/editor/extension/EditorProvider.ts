import vscode from 'vscode'
import { Messenger } from '../../lib/ExtensionMessenger'
import parseDocument from './parseDocument'
import updateDocument from './updateDocument'

class EditorProvider implements vscode.CustomTextEditorProvider {
    public static readonly viewType = 'KitchenSink.EditorProvider'
    public static singleton: EditorProvider | undefined
    private readonly extensionUri: vscode.Uri

    private constructor(extensionUri: vscode.Uri) {
        this.extensionUri = extensionUri
    }

    static instance(extensionUri: vscode.Uri): EditorProvider {
        if (! EditorProvider.singleton) {
            EditorProvider.singleton = new EditorProvider(extensionUri)
        }
        return EditorProvider.singleton
    }

    public async resolveCustomTextEditor(document: vscode.TextDocument, panel: vscode.WebviewPanel, _token: vscode.CancellationToken): Promise<void> {
        panel.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'dist')],
        }
        panel.webview.html = this.getHtmlForWebview(panel.webview)

        const messenger = new Messenger()

        // Pass commands to webview
        const webview = {
            hydrate(topleft: number[]): void {
                messenger.postVoidPayload('hydrate', topleft)
            }
        }

        // Handle commands received from webview
        const extension = {
            showMessage(payload: string): void {
                vscode.window.showInformationMessage(payload)
            },
            update(topleft: number[]): void {
                updateDocument(document, topleft)
            },
        }

        messenger.applyReceivedMessagesTo(extension)
        messenger.receiveMessagesFrom(panel.webview)
        messenger.sendMessagesTo(panel.webview)
        messenger.subscribe()

        function parseDocumentAndHydrateWebview() {
            parseDocument(document)
                .then(topleft => webview.hydrate(topleft))
                .catch(error => vscode.window.showErrorMessage(error.toString()))
        }

        const _onChangeTextDocument = vscode.workspace.onDidChangeTextDocument(event => {
            if (event.document.uri.toString() === document.uri.toString()) {
                parseDocumentAndHydrateWebview()
            }
        })

        const _onDisposePanel = panel.onDidDispose(() => {
            messenger.dispose()
            _onChangeTextDocument.dispose()
            _onDisposePanel.dispose()
        })

        parseDocumentAndHydrateWebview()
    }

    getHtmlForWebview(webview: vscode.Webview): string {
        return [
            '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">',
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
                '<meta content="default-src ', webview.cspSource, ';" http-equiv="Content-Security-Policy">',
                '<link rel="stylesheet" href="',
                    webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'dist/webview/editor/webview/editor.css')),
                '">',
                '<script defer src="',
                    webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'dist/webview/editor/webview/editor.js')),
                '"></script>',
            '</head><body></body></html>',
        ].join('')
    }
}

export default EditorProvider
