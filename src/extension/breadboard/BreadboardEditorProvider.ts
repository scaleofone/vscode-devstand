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
import { shouldReportError, ValidationError } from '../../errorHandling'

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
            },
            editorSettings(payload: payloads.EditorSettings): void {
                messenger.postVoidPayload('editorSettings', payload)
            },
        }

        const applyWorkspaceEdit = (textEdits: vscode.TextEdit[]) => {
            const edit = new vscode.WorkspaceEdit()
            edit.set(document.uri, textEdits)
            return vscode.workspace.applyEdit(edit)
        }

        // Handle commands received from webview
        const extension = {
            openDocument(payload: payloads.OpenDocument): void {
                vscode.commands.executeCommand('vscode.open', document.uri, {
                    preserveFocus: ('preserveFocus' in payload ? payload.preserveFocus : undefined),
                    preview: ('preview' in payload ? payload.preview : undefined),
                    selection: ('selection' in payload ? (new vscode.Range(payload.selection.startLine, payload.selection.startCharacter, payload.selection.endLine, payload.selection.endCharacter)) : undefined),
                    viewColumn: ('viewColumn' in payload ? vscode.ViewColumn[payload.viewColumn] : undefined),
                })
            },
            slowOperation(): Promise<string> {
                return new Promise((resolve, reject) => {
                    setTimeout(() => { resolve('howdy!') }, 5000)
                })
            },
            async showMessage(payload: string): Promise<void> {
                if (payload == 'reject') { return Promise.reject() }
                if (payload == 'reject string') { return Promise.reject('String rejected') }
                if (payload == 'reject object') { return Promise.reject({ prop: 'value', rejected: true }) }
                if (payload == 'reject error') { return Promise.reject(new Error('Rejected error message')) }
                if (payload == 'reject custom') {
                    let error = new Error('Custom message')
                    error.name = 'CUSTOM'
                    return Promise.reject(error)
                }
                if (payload == 'throw string') { throw 'String thrown' }
                if (payload == 'throw object') { throw { prop: 'value', thrown: true } }
                if (payload == 'throw error') { throw new Error('Thrown error message') }
                if (payload == 'throw custom') {
                    let error = new Error('Custom message')
                    error.name = 'CUSTOM'
                    throw error
                }

                vscode.window.showInformationMessage(payload)
            },
            async renameComponent(payload: payloads.RenameComponent): Promise<void> {
                await applyWorkspaceEdit([ renameComponent(document, payload) ])
            },
            async deleteComponent(payload: payloads.DeleteComponent): Promise<void> {
                let textEdits = [
                    deleteComponent(document, payload)
                ]

                let breadboard = await parseDocument(document)
                const componentToDelete = breadboard.components.find(c => c.identifier == payload.identifier)
                const otherComponentsOfTheSameTemplate = breadboard.components.filter(c => (
                    c.templateImportVariableName == componentToDelete.templateImportVariableName
                    && c.identifier != componentToDelete.identifier
                ))
                if (otherComponentsOfTheSameTemplate.length == 0) {
                    textEdits.push(
                        deleteTemplateImport(document, {
                            variableName: componentToDelete.templateImportVariableName
                        })
                    )
                }
                await applyWorkspaceEdit(textEdits)
            },
            async deleteRecord(payload: payloads.DeleteRecord): Promise<void> {
                await applyWorkspaceEdit([ deleteRecord(document, payload) ])
            },
            async createRecordValue(payload: payloads.CreateRecordValue): Promise<void> {
                await applyWorkspaceEdit([ createRecordValue(document, payload) ])
            },
            async updateRecordValue(payload: payloads.UpdateRecordValue): Promise<void> {
                if (payload.updateRecordValue == 'ololo') {
                    throw new ValidationError('Value not allowed '+Math.random().toString().substr(2, 3), 'updateRecordValue')
                }
                await applyWorkspaceEdit([ updateRecordValue(document, payload) ])
            },
            async modifyRecord(payload: payloads.ModifyRecord): Promise<void> {
                if (payload.updateRecordValue == 'ololo') {
                    throw new ValidationError('Value not allowed '+Math.random().toString().substr(2, 3), 'updateRecordValue')
                }
                await applyWorkspaceEdit([
                    updateRecordValue(document, payload),
                    renameRecord(document, payload),
                ])
            },

            async actionCreateComponent(): Promise<void> {
                let result = await createNewComponent()

                let breadboard = await parseDocument(document)
                const alreadyPresentTemplateImport = breadboard.templateImports.find(ti => (
                    ti.targetFile == result.templateImport.targetFile
                    && ti.targetIdentifier == result.templateImport.targetIdentifier
                ))

                let textEdits = [
                    createComponent(document, {
                        componentIdentifier: result.component.identifier,
                        templateImportVariableName: (
                            alreadyPresentTemplateImport
                                ? alreadyPresentTemplateImport.variableName
                                : result.component.templateImportVariableName
                        ),
                    })
                ]
                if (! alreadyPresentTemplateImport) {
                    textEdits.push(
                        createTemplateImport(document, {
                            variableName: result.templateImport.variableName,
                            targetFile: result.templateImport.targetFile,
                            targetIdentifier: result.templateImport.targetIdentifier,
                        })
                    )
                }
                await applyWorkspaceEdit(textEdits)
            },
        }

        messenger.applyReceivedMessagesTo(extension)
        messenger.receiveMessagesFrom(panel.webview)
        messenger.sendMessagesTo(panel.webview)
        messenger.useErrorHandler((err: Error | object, message: MessengerMessage) => {
            if (! shouldReportError(err)) { return }
            vscode.window.showErrorMessage((err instanceof Error) ? err.toString() : 'Thrown object: '+JSON.stringify(err))
        })
        messenger.subscribe()

        function parseDocumentAndHydrateWebview() {
            parseDocument(document)
                .then(breadboard => webview.hydrate(breadboard))
                .catch(error => vscode.window.showErrorMessage(error.toString()))
        }

        function sendEditorSettings() {
            webview.editorSettings(getEditorSettings())
        }

        const _onChangeTextDocument = vscode.workspace.onDidChangeTextDocument(event => {
            if (event.document.uri.toString() === document.uri.toString()) {
                parseDocumentAndHydrateWebview()
            }
        })

        const _onDidChangeConfiguration = vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('editor')) {
                sendEditorSettings()
            }
        })

        const _onDisposePanel = panel.onDidDispose(() => {
            messenger.dispose()
            _onChangeTextDocument.dispose()
            _onDidChangeConfiguration.dispose()
            _onDisposePanel.dispose()
        })

        sendEditorSettings()
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

function getEditorSettings(): payloads.EditorSettings {
    const editorConfig = vscode.workspace.getConfiguration('editor')
    const fontSize = parseFloat(editorConfig.get('fontSize').toString())
    const lineHeightSetting = parseFloat(editorConfig.get('lineHeight').toString())
    let lineHeight: number, lineHeightFraction: number
    if (lineHeightSetting < 8) {
        lineHeightFraction = (lineHeightSetting == 0) ? 1.5 : lineHeightSetting
        lineHeight = Math.round(fontSize * lineHeightFraction)
    } else {
        lineHeight = Math.round(lineHeightSetting)
        lineHeightFraction = parseFloat((lineHeight / fontSize).toFixed(1))
    }
    return { fontSize, lineHeight, lineHeightFraction }
}

export default BreadboardEditorProvider
