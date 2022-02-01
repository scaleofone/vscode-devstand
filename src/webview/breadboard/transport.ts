import vscodeApi from '../vscode.js'
import { Messenger } from '../Messenger'

import { components, records, templateImports } from './stores/breadboard'
import * as payloads from '../../TransportPayloads'
import { Breadboard } from '../../BreadboardTypes'

const messenger = new Messenger()


const extension = {
    showMessage(text: string): void {
        messenger.postVoidPayload('showMessage', text)
    },
    createComponent(payload: payloads.CreateComponent): void {
        messenger.postVoidPayload('createComponent', payload)
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
    actionCreateComponent(): void {
        messenger.postVoidPayload('actionCreateComponent', null)
    },
}

const webview = {
    hydrate(breadboard: Breadboard): void {
        components.set(breadboard.components)
        records.set(breadboard.records)
        templateImports.set(breadboard.templateImports)
    },
}

messenger.applyReceivedMessagesTo(webview)
messenger.sendMessagesTo(vscodeApi)
messenger.subscribe()

export { extension }
