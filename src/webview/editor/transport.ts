import vscodeApi from '../vscode.js'

import { Messenger } from '../Messenger'
import { top, left, recenter } from './stores/point.js'
import { get_store_value } from 'svelte/internal'

const messenger = new Messenger()

const extension = {
    //
}

const webview = {
    recenter(): void {
        recenter()
    },
    async getTopLeft(): Promise<[number, number]> {
        return Promise.resolve([get_store_value(top), get_store_value(left)])
    },
}

messenger.applyReceivedMessagesTo(webview)
messenger.sendMessagesTo(vscodeApi)
messenger.subscribe()

export { extension }
