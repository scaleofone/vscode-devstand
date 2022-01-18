import vscodeApi from '../vscode.js'
import { Messenger } from '../Messenger'

import { resultCreateNewComponent } from './stores/breadboard'
import * as payloads from '../../TransportPayloads.js'

const messenger = new Messenger()


const extension = {
    showMessage(text: string): void {
        messenger.postVoidPayload('showMessage', text)
    },
    update(breadboard): void {
        messenger.postVoidPayload('update', breadboard)
    },
    renameComponent(payload: payloads.RenameComponent): void {
        messenger.postVoidPayload('renameComponent', payload)
    },
    createTemplateImport(payload: payloads.CreateTemplateImport): void {
        messenger.postVoidPayload('createTemplateImport', payload)
    },
    deleteTemplateImport(payload: payloads.DeleteTemplateImport): void {
        messenger.postVoidPayload('deleteTemplateImport', payload)
    },
    deleteComponent(payload: payloads.DeleteComponent): void {
        messenger.postVoidPayload('deleteComponent', payload)
    },
    deleteRecord(payload: payloads.DeleteRecord): void {
        messenger.postVoidPayload('deleteRecord', payload)
    },
    renameRecord(payload: payloads.RenameRecord): void {
        messenger.postVoidPayload('renameRecord', payload)
    },
    createRecordValue(payload: payloads.CreateRecordValue): void {
        if (payload.recordValue.toString().match(/^[1-9][0-9]*$/)) {
            payload.recordValue = parseInt(payload.recordValue.toString())
        }
        messenger.postVoidPayload('createRecordValue', payload)
    },
    updateRecordValue(payload: payloads.UpdateRecordValue): void {
        messenger.postVoidPayload('updateRecordValue', payload)
    },
    async createNewComponent(): Promise<{ templateImport:object, component:object }> {
        return messenger.postRequestPayload('createNewComponent', null)
    },
}

const webview = {
    hydrate(breadboard): void {
        resultCreateNewComponent.set(breadboard)
    },
}

messenger.applyReceivedMessagesTo(webview)
messenger.sendMessagesTo(vscodeApi)
messenger.subscribe()

export { extension }
