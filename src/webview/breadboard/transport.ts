import vscodeApi from '../vscode.js'
import { Messenger } from '../Messenger'

import { schemaDictionary, templateImports, components, records } from './stores/breadboard'
import { editorSettings } from './stores/misc'
import * as payloads from '../../TransportPayloads'
import { Breadboard } from '../../BreadboardTypes'
import { AbortablePromise } from '../../AbortablePromise.js'

const messenger = new Messenger()


const extension = {
    openDocument(payload: payloads.OpenDocument): void {
        messenger.postVoidPayload('openDocument', payload)
    },
    slowOperation(): AbortablePromise<string> {
        return messenger.postRequestPayload('slowOperation', null)
    },
    showMessage(text: string): AbortablePromise<void> {
        return messenger.postRequestPayload('showMessage', text)
    },
    renameComponent(payload: payloads.RenameComponent): void {
        messenger.postVoidPayload('renameComponent', payload)
    },
    deleteComponent(payload: payloads.DeleteComponent): void {
        messenger.postVoidPayload('deleteComponent', payload)
    },
    deleteRecord(payload: payloads.DeleteRecord): void {
        messenger.postVoidPayload('deleteRecord', payload)
    },
    createRecordValue(payload: payloads.CreateRecordValue): void {
        messenger.postVoidPayload('createRecordValue', payload)
    },
    updateRecordValue(payload: payloads.UpdateRecordValue): AbortablePromise<void> {
        return messenger.postRequestPayload('updateRecordValue', payload)
    },
    modifyRecord(payload: payloads.ModifyRecord): AbortablePromise<void> {
        return messenger.postRequestPayload('modifyRecord', payload)
    },
    actionCreateComponent(): void {
        messenger.postVoidPayload('actionCreateComponent', null)
    },
}

const webview = {
    hydrate(breadboard: Breadboard): void {
        schemaDictionary.set(breadboard.schemaDictionary)
        templateImports.set(breadboard.templateImports)
        components.set(breadboard.components)
        records.set(breadboard.records)
    },
    editorSettings(payload: payloads.EditorSettings): void {
        editorSettings.set(payload)
    },
}

messenger.applyReceivedMessagesTo(webview)
messenger.sendMessagesTo(vscodeApi)
messenger.subscribe()

export { extension }
