import vscode from 'vscode'
import { Messenger } from '../Messenger'
import { Breadboard } from './jsonnet/BreadboardTypes'
import parseDocument from './parseDocument'
import updateDocument from './updateDocument'
import createNewComponent from './createNewComponent'

import renameComponent from './renameComponent'
import addTemplateImport from './addTemplateImport'
import removeTemplateImport from './removeTemplateImport'
import removeComponent from './removeComponent'
import removeRecord from './removeRecord'
import renameRecord from './renameRecord'
import { RenameComponent, AddTemplateImport, RemoveTemplateImport, RemoveComponent, RemoveRecord, RenameRecord } from '../../TransportPayloads'

class BreadboardEditorProvider implements vscode.CustomTextEditorProvider {
    public static readonly viewType = 'KitchenSink.BreadboardEditorProvider'
    public static singleton: BreadboardEditorProvider | undefined
    private readonly extensionUri: vscode.Uri

    private constructor(extensionUri: vscode.Uri) {
        this.extensionUri = extensionUri
    }

    static instance(extensionUri: vscode.Uri): BreadboardEditorProvider {
        if (! BreadboardEditorProvider.singleton) {
            BreadboardEditorProvider.singleton = new BreadboardEditorProvider(extensionUri)
        }
        return BreadboardEditorProvider.singleton
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
            hydrate(breadboard: Breadboard): void {
                messenger.postVoidPayload('hydrate', breadboard)
            }
        }

        // Handle commands received from webview
        const extension = {
            showMessage(payload: string): void {
                vscode.window.showInformationMessage(payload)
            },
            update(breadboard: Breadboard): void {
                updateDocument(document, breadboard)
            },
            renameComponent(payload: RenameComponent): void {
                renameComponent(document, payload)
            },
            addTemplateImport(payload: AddTemplateImport): void {
                addTemplateImport(document, payload)
            },
            removeTemplateImport(payload: RemoveTemplateImport): void {
                removeTemplateImport(document, payload)
            },
            removeComponent(payload: RemoveComponent): void {
                removeComponent(document, payload)
            },
            removeRecord(payload: RemoveRecord): void {
                removeRecord(document, payload)
            },
            renameRecord(payload: RenameRecord): void {
                renameRecord(document, payload)
            },
            createNewComponent,
        }

        messenger.applyReceivedMessagesTo(extension)
        messenger.receiveMessagesFrom(panel.webview)
        messenger.sendMessagesTo(panel.webview)
        messenger.subscribe()

        function parseDocumentAndHydrateWebview() {
            parseDocument(document)
                .then(breadboard => webview.hydrate(breadboard))
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
                    webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'dist/webview/breadboard/breadboard.css')),
                '">',
                '<script defer src="',
                    webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'dist/webview/breadboard/breadboard.js')),
                '"></script>',
            '</head><body></body></html>',
        ].join('')
    }
}

export default BreadboardEditorProvider
