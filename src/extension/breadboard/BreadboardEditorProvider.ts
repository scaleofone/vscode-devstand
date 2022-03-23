import vscode from 'vscode'
import { debounce } from 'throttle-debounce'

import { Messenger, MessengerMessage } from '../Messenger'
import { Breadboard } from '../../BreadboardTypes'
import parseDocument from './parseDocument'
import createNewComponent from './createNewComponent'

import renameComponent from './operations/renameComponent'
import renameComponentGeometry from './operations/renameComponentGeometry'
import createTemplateImport from './operations/createTemplateImport'
import deleteTemplateImport from './operations/deleteTemplateImport'
import deleteComponent from './operations/deleteComponent'
import deleteComponentGeometry from './operations/deleteComponentGeometry'
import deleteRecord from './operations/deleteRecord'
import createRecordValue from './operations/createRecordValue'
import createScopeWithRecords from './operations/createScopeWithRecords'
import renameRecord from './operations/renameRecord'
import updateRecordValue from './operations/updateRecordValue'
import createComponent from './operations/createComponent'
import mutateComponentGeometry from './operations/mutateComponentGeometry'

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
            async mutateComponentGeometry(payload: payloads.MutateComponentGeometry): Promise<void> {
                await applyWorkspaceEdit([ mutateComponentGeometry(document, payload) ])
            },
            async renameComponent(payload: payloads.RenameComponent): Promise<void> {
                if (payload.after == 'fail') {
                    throw new ValidationError('Value not allowed '+Math.random().toString().substr(2, 3), 'after')
                }
                await applyWorkspaceEdit([
                    renameComponentGeometry(document, payload),
                    renameComponent(document, payload),
                ])
            },
            async deleteComponent(payload: payloads.DeleteComponent): Promise<void> {
                let textEdits = [
                    deleteComponentGeometry(document, payload),
                    deleteComponent(document, payload),
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
            async createScopeWithRecords(payload: payloads.CreateScopeWithRecords): Promise<void> {
                await applyWorkspaceEdit([ createScopeWithRecords(document, payload) ])
            },
            async modifyRecord(payload: payloads.ModifyRecord): Promise<void> {
                // TODO perform validation inside operations, not here
                if (payload.updateRecordValue == 'ololo') {
                    throw new ValidationError('Value not allowed '+Math.random().toString().substr(2, 3), 'updateRecordValue')
                }
                await applyWorkspaceEdit([
                    updateRecordValue(document, payload),
                    renameRecord(document, payload),
                ])
            },

            async actionCreateComponent(payload?: payloads.NewComponentGeometry): Promise<void> {
                let result = await createNewComponent()

                let breadboard = await parseDocument(document)
                const alreadyPresentTemplateImport = breadboard.templateImports.find(ti => (
                    ti.targetFile == result.templateImport.targetFile
                    && ti.targetIdentifier == result.templateImport.targetIdentifier
                ))

                const createComponentTextEdit = createComponent(document, {
                    componentIdentifier: result.component.identifier,
                    templateImportVariableName: (
                        alreadyPresentTemplateImport
                            ? alreadyPresentTemplateImport.variableName
                            : result.component.templateImportVariableName
                    ),
                }, payload)
                let textEdits = [
                    createComponentTextEdit,
                ]

                // if createComponent() returned 'replace' textEdit (creating the whole object with inner component) then createComponentTextEdit.range.isEmpty == false
                // if createComponent() returned 'insert' textEdit (inserting inner component into already existing object) then createComponentTextEdit.range.isEmpty == true
                if (createComponentTextEdit.range.isEmpty) {
                    textEdits.push(
                        mutateComponentGeometry(document, {
                            componentIdentifier: result.component.identifier,
                            colorIndex: payload.colorIndex,
                            cornerX: payload.cornerX,
                            cornerY: payload.cornerY,
                        })
                    )
                }

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

        const parseDocumentAndHydrateWebview = debounce(50, false, _parseDocumentAndHydrateWebview)
        function _parseDocumentAndHydrateWebview() {
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

        let wasVisible = undefined
        const _onDidChangeViewState = panel.onDidChangeViewState((event) => {
            const visibleChanged = wasVisible !== event.webviewPanel.visible
            // console.log(visibleChanged ? 'VISIBLE CHANGED' : 'STILL VISIBLE')

            if (! event.webviewPanel.visible) {
                messenger.ready(false, 'PROVIDER')
            }
            if (visibleChanged && event.webviewPanel.visible) {
                sendEditorSettings()
                parseDocumentAndHydrateWebview()
            }

            wasVisible = event.webviewPanel.visible
        })

        const _onDisposePanel = panel.onDidDispose(() => {
            messenger.dispose()
            _onChangeTextDocument.dispose()
            _onDidChangeConfiguration.dispose()
            _onDisposePanel.dispose()
            _onDidChangeViewState.dispose()
        })

        sendEditorSettings()
        parseDocumentAndHydrateWebview()
    }

    getHtmlForWebview(webview: vscode.Webview): string {
        const cspHeader = `default-src 'self' ${webview.cspSource}; `
                        + `style-src 'self' 'unsafe-inline' ${webview.cspSource}; `
                        + `img-src 'self' data: ${webview.cspSource}; `
        const styleHref = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'dist/webview/breadboard/visual.css'))
        const scriptHref = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'dist/webview/breadboard/visual.js'))
        return [
            '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">',
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
                `<meta content="${cspHeader}" http-equiv="Content-Security-Policy">`,
                `<link href="${styleHref}" rel="stylesheet">`,
                `<script defer src="${scriptHref}"></script>`,
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
