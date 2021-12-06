import vscode from 'vscode'
import { Messenger } from '../Messenger'

let messenger: Messenger

const webview = {
    recenter(): void {
        messenger.postVoidPayload('recenter', null)
    },
    getTopLeft(): Promise<[number, number]> {
        return messenger.postRequestPayload('getTopLeft', null)
    },
}

const extension = {
    //
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
