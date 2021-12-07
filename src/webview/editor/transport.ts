import vscodeApi from '../vscode.js'

import { Messenger } from '../Messenger'
import { top, left } from './stores/point.js'

const messenger = new Messenger()

const extension = {
    update(topleft: number[]): void {
        messenger.postVoidPayload('update', topleft)
    },
}

const webview = {
    hydrate(topleft: number[]): void {
        top.set(topleft[0])
        left.set(topleft[1])
    },
}

messenger.applyReceivedMessagesTo(webview)
messenger.sendMessagesTo(vscodeApi)
messenger.subscribe()

export { extension }
