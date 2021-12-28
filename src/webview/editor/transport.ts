import vscodeApi from '../vscode.js'

import { Messenger } from '../Messenger'
import { top, left, justHydrated } from './stores/point.js'

const messenger = new Messenger()

const extension = {
    showMessage(text: string): void {
        messenger.postVoidPayload('showMessage', text)
    },
    update(topleft: number[]): void {
        messenger.postVoidPayload('update', topleft)
    },
}

const webview = {
    hydrate(topleft: number[]): void {
        justHydrated.set(true)
        top.set(topleft[0])
        left.set(topleft[1])
    },
}

messenger.applyReceivedMessagesTo(webview)
messenger.sendMessagesTo(vscodeApi)
messenger.subscribe()

export { extension }
