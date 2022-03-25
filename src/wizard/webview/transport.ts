import vscodeApi from '../../lib/vscodeApi.js'

import { Messenger } from '../../lib/WebviewMessenger'
import { getFileContent, filesToSave } from './stores/snippets.js'
import { get_store_value } from 'svelte/internal'

const messenger = new Messenger()

const extension = {
    showMessage(text: string): void {
        messenger.postVoidPayload('showMessage', text)
    },
    saveSnippets(): void {
        messenger.postVoidPayload('saveSnippets', null)
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

export { extension }
