import vscodeApi from '../../lib/vscodeApi'
import { Messenger } from '../../lib/WebviewMessenger'

import { get } from 'svelte/store'
import { schemaDictionary, templateImports, components, records, justCreatedComponentIdentifiers } from './stores/breadboard'
import { unPersistedRecords, rememberUnPersistedRecordsBeforeHydrate, getUnPersistedRecordsBeforeHydrate } from './stores/persist'
import { editorSettings, EditorSettings } from '../../lib/editorSettings'
import * as payloads from '../TransportPayloads'
import { Breadboard } from '../BreadboardTypes'
import { AbortablePromise } from '../../lib/AbortablePromise.js'

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
    renameComponent(payload: payloads.RenameComponent): AbortablePromise<void> {
        return messenger.postRequestPayload('renameComponent', payload)
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
    actionCreateComponent(payload: payloads.NewComponentGeometry): void {
        messenger.postVoidPayload('actionCreateComponent', payload)
    },
    actionDeployButton(): void {
        messenger.postVoidPayload('actionDeployButton', null)
    },
    mutateComponentGeometry(payload: payloads.MutateComponentGeometry): void {
        messenger.postVoidPayload('mutateComponentGeometry', payload)
    }
}

let initialHydrationHappened = false

const webview = {
    hydrate(breadboard: Breadboard): void {
        rememberUnPersistedRecordsBeforeHydrate()
        schemaDictionary.set(breadboard.schemaDictionary)
        templateImports.set(breadboard.templateImports)

        if (initialHydrationHappened) {
            let currentComponentsIdentifiers = get(components).map(c => c.identifier)
            justCreatedComponentIdentifiers.set(
                breadboard.components.map(c => c.identifier).filter(id => ! currentComponentsIdentifiers.includes(id))
            )
            setTimeout(() => justCreatedComponentIdentifiers.set([]), 50)
        }
        components.set(breadboard.components)

        records.set([...breadboard.records, ...getUnPersistedRecordsBeforeHydrate(breadboard.records)])
        unPersistedRecords.set([])

        initialHydrationHappened = true
    },
    editorSettings(payload: EditorSettings): void {
        editorSettings.set(payload)
    },
}

messenger.applyReceivedMessagesTo(webview)
messenger.sendMessagesTo(vscodeApi)
messenger.subscribe()

function messengerReady(isReady: boolean): void {
    messenger.ready(isReady)
}

export { extension, messengerReady }
