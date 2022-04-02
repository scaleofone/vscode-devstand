import vscodeApi from '../../lib/vscodeApi.js'

import { Messenger } from '../../lib/WebviewMessenger'
import * as payloads from '../TransportPayloads'

import { AbortablePromise } from '../../lib/AbortablePromise.js'

import { openedFromFolderPath, workspaceFolderPath } from './stores/distro'

const messenger = new Messenger()

const extension = {
    showMessage(text: string): void {
        messenger.postVoidPayload('showMessage', text)
    },
    requestListing(payload: payloads.RequestListing): AbortablePromise<string[]> {
        return messenger.postRequestPayload('requestListing', payload)
    },
    requestFindFiles(payload: payloads.RequestFindFiles): AbortablePromise<string[]> {
        return messenger.postRequestPayload('requestFindFiles', payload)
    },
    createFiles(payload: payloads.CreateFile[]): AbortablePromise<void> {
        return messenger.postRequestPayload('createFiles', payload)
    },
    notifyFilesCreated(payload: payloads.NotifyFilesCreated): void {
        messenger.postVoidPayload('notifyFilesCreated', payload)
    },
}

const webview = {
    setOpenedFromFolder(payload: payloads.SetOpenedFromFolder): void {
        openedFromFolderPath.set(payload.path)
        workspaceFolderPath.set(payload.workspaceFolderPath)
    },
}

messenger.applyReceivedMessagesTo(webview)
messenger.sendMessagesTo(vscodeApi)
messenger.subscribe()

function messengerReady(isReady: boolean): void {
    messenger.ready(isReady)
}

export { messengerReady, extension }
