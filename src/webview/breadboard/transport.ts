import vscodeApi from '../vscode.js'
import { Messenger } from '../Messenger'

import { get } from 'svelte/store'
import { schemaDictionary, templateImports, components, records } from './stores/breadboard'
import { unPersistedRecords, rememberUnPersistedRecordsBeforeHydrate, getUnPersistedRecordsBeforeHydrate } from './stores/persist'
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
    createRecordValue(payload: payloads.CreateRecordValue): AbortablePromise<void> {
        return messenger.postRequestPayload('createRecordValue', payload)
    },
    createScopeWithRecords(payload: payloads.CreateScopeWithRecords): AbortablePromise<void> {
        return messenger.postRequestPayload('createScopeWithRecords', payload)
    },
    modifyRecord(payload: payloads.ModifyRecord): AbortablePromise<void> {
        return messenger.postRequestPayload('modifyRecord', payload)
    },
    actionCreateComponent(): void {
        messenger.postVoidPayload('actionCreateComponent', null)
    },
    mutateComponentGeometry(payload: payloads.MutateComponentGeometry): void {
        messenger.postVoidPayload('mutateComponentGeometry', payload)
    }
}

const webview = {
    hydrate(breadboard: Breadboard): void {
        rememberUnPersistedRecordsBeforeHydrate()
        schemaDictionary.set(breadboard.schemaDictionary)
        templateImports.set(breadboard.templateImports)
        components.set(breadboard.components)
        records.set([...breadboard.records, ...getUnPersistedRecordsBeforeHydrate(breadboard.records)])
        unPersistedRecords.set([])
    },
    editorSettings(payload: payloads.EditorSettings): void {
        editorSettings.set({
            ...payload,
            halfFontSize: payload.halfFontSize || Math.round(payload.fontSize / 2),
            quaterFontSize: payload.quaterFontSize || Math.round(payload.fontSize / 4),
        })
    },
}

messenger.applyReceivedMessagesTo(webview)
messenger.sendMessagesTo(vscodeApi)
messenger.subscribe()

function messengerReady(isReady: boolean): void {
    messenger.ready(isReady)
}

export { extension, messengerReady }
