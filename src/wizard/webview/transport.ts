import vscodeApi from '../../lib/vscodeApi.js'

import { Messenger } from '../../lib/WebviewMessenger'
import * as payloads from '../TransportPayloads'

import { getFileContent, filesToSave } from './stores/snippets.js'
import { get_store_value } from 'svelte/internal'
import { AbortablePromise } from '../../lib/AbortablePromise.js'

const messenger = new Messenger()

const extension = {
    showMessage(text: string): void {
        messenger.postVoidPayload('showMessage', text)
    },
    saveSnippets(): void {
        messenger.postVoidPayload('saveSnippets', null)
    },
    requestListing(payload: payloads.RequestListing): AbortablePromise<string[]> {
        return messenger.postRequestPayload('requestListing', payload)
    },
    requestFindFiles(payload: payloads.RequestFindFiles): AbortablePromise<string[]> {
        return messenger.postRequestPayload('requestFindFiles', payload)
    },
}

const webview = {
    getFilesToSave(): Promise<string[]> {
        return Promise.resolve(get_store_value(filesToSave))
    },
    getFileContent(filename: string): Promise<string> {
        return Promise.resolve(getFileContent(filename))
    },
}

messenger.applyReceivedMessagesTo(webview)
messenger.sendMessagesTo(vscodeApi)
messenger.subscribe()

function messengerReady(isReady: boolean): void {
    messenger.ready(isReady)
}

export { messengerReady, extension }
