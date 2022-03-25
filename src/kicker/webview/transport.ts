import vscodeApi from '../../lib/vscodeApi.js'

import { Messenger } from '../../lib/WebviewMessenger'
import { listing } from './stores/listing.js'
import { get_store_value } from 'svelte/internal'

const messenger = new Messenger()

const extension = {
    showMessage(text: string): void {
        messenger.postVoidPayload('showMessage', text)
    },
    async requestListing(directory: string): Promise<string[]> {
        return messenger.postRequestPayload('requestListing', directory)
    },
    async requestFindFiles(pattern: string | { pattern:string, exclude?:string }): Promise<string[]> {
        return messenger.postRequestPayload('requestFindFiles', pattern)
    },
}

const webview = {
    async truncateListing(count: number): Promise<number> {
        listing.truncate(count)
        return Promise.resolve(get_store_value(listing).length)
    },
    resetListing(): void {
        listing.reset()
    },
}

messenger.applyReceivedMessagesTo(webview)
messenger.sendMessagesTo(vscodeApi)
messenger.subscribe()

export { extension }
