import vscode from 'vscode'
import { Messenger } from '../../lib/ExtensionMessenger'
import saveSnippets from './saveSnippets'
import requestListing from './operations/requestListing'
import requestFindFiles from './operations/requestFindFiles'

let messenger: Messenger

const webview = {
    async getFilesToSave(): Promise<string[]> {
        return messenger.postRequestPayload('getFilesToSave', null)
    },
    async getFileContent(filename: string): Promise<string> {
        return messenger.postRequestPayload('getFileContent', filename)
    },
}

const extension = {
    showMessage(payload: string): void {
        vscode.window.showInformationMessage(payload)
    },
    saveSnippets,
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
