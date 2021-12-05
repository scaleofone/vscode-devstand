import vscode from 'vscode'
import { Messenger } from '../Messenger'
import requestListing from './requestListing'
import requestFindFiles from './requestFindFiles'

let messenger: Messenger

const webview = {
    async truncateListing(count: number): Promise<number> {
        return messenger.postRequestPayload('truncateListing', count)
    },
    resetListing(): void {
        messenger.postVoidPayload('resetListing', null)
    },
}

const extension = {
    showMessage(payload: string): void {
        vscode.window.showInformationMessage(payload)
    },
    requestListing,
    requestFindFiles,
}

let invokedBefore = -1
function setup(webviewWindow: vscode.Webview) {
    if (++invokedBefore) throw new Error()
    messenger = new Messenger()
    messenger.applyReceivedMessagesTo(extension)
    messenger.receiveMessagesFrom(webviewWindow)
    messenger.sendMessagesTo(webviewWindow)
    messenger.subscribe()
}

function teardown() {
    messenger.dispose()
    messenger = undefined
    invokedBefore = -1
}

export { webview, setup, teardown }
