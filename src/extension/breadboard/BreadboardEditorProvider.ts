import vscode from 'vscode'
import { Messenger, MessengerMessage } from '../Messenger'
import { Breadboard } from '../../BreadboardTypes'
import parseDocument from './parseDocument'
import createNewComponent from './createNewComponent'

import renameComponent from './operations/renameComponent'
import createTemplateImport from './operations/createTemplateImport'
import deleteTemplateImport from './operations/deleteTemplateImport'
import deleteComponent from './operations/deleteComponent'
import deleteRecord from './operations/deleteRecord'
import createRecordValue from './operations/createRecordValue'
import renameRecord from './operations/renameRecord'
import updateRecordValue from './operations/updateRecordValue'
import createComponent from './operations/createComponent'

import * as payloads from '../../TransportPayloads'

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
            async createComponent(payload: payloads.CreateComponent): Promise<void> {
                await createComponent(document, payload)
            },
            async renameComponent(payload: payloads.RenameComponent): Promise<void> {
                await renameComponent(document, payload)
            },
            async createTemplateImport(payload: payloads.CreateTemplateImport): Promise<void> {
                await createTemplateImport(document, payload)
            },
            async deleteTemplateImport(payload: payloads.DeleteTemplateImport): Promise<void> {
                await deleteTemplateImport(document, payload)
            },
            async deleteComponent(payload: payloads.DeleteComponent): Promise<void> {
                await deleteComponent(document, payload)
            },
            async deleteRecord(payload: payloads.DeleteRecord): Promise<void> {
                await deleteRecord(document, payload)
            },
            async createRecordValue(payload: payloads.CreateRecordValue): Promise<void> {
                await createRecordValue(document, payload)
            },
            async renameRecord(payload: payloads.RenameRecord): Promise<void> {
                await renameRecord(document, payload)
            },
            async updateRecordValue(payload: payloads.UpdateRecordValue): Promise<void> {
                await updateRecordValue(document, payload)
            },

            async actionCreateComponent(): Promise<void> {
                let result = await createNewComponent()
                // TODO validate componentIdentifier is already present
                // TODO validate componentIdentifier is not a reserved jsonnet keyword (eg: local/function)
                await createComponent(document, {
                    componentIdentifier: result.component.identifier,
                    templateImportVariableName: result.component.templateImportVariableName,
                })
                // TODO omit creating if targetIdentifier is already present
                // TODO use another variableName if targetIdentifier is already present
                await createTemplateImport(document, {
                    variableName: result.templateImport.variableName,
                    targetFile: result.templateImport.targetFile,
                    targetIdentifier: result.templateImport.targetIdentifier,
                })
            },
        }

        messenger.applyReceivedMessagesTo(extension)
        messenger.receiveMessagesFrom(panel.webview)
        messenger.sendMessagesTo(panel.webview)
        messenger.useErrorHandler((error: Error, message: MessengerMessage) => {
            vscode.window.showErrorMessage(error.message)
            console.warn(message)
        })
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
