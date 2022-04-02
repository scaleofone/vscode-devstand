import vscode from 'vscode'
import { Messenger } from '../../lib/ExtensionMessenger'
import saveSnippets from './saveSnippets'
import requestListing from './operations/requestListing'
import requestFindFiles from './operations/requestFindFiles'
import createFiles from './operations/createFiles'
import notifyFilesCreated from './operations/notifyFilesCreated'
import * as payloads from '../TransportPayloads'

let messenger: Messenger

const webview = {
    async getFilesToSave(): Promise<string[]> {
        return messenger.postRequestPayload('getFilesToSave', null)
    },
    async getFileContent(filename: string): Promise<string> {
        return messenger.postRequestPayload('getFileContent', filename)
    },
    setOpenedFromFolder(payload: payloads.SetOpenedFromFolder): void {
        messenger.postVoidPayload('setOpenedFromFolder', payload)
    },
}

const extension = {
    showMessage(payload: string): void {
        vscode.window.showInformationMessage(payload)
    },
    saveSnippets,
    requestListing,
    requestFindFiles,
    createFiles,
    notifyFilesCreated,
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
