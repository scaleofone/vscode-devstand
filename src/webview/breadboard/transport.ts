import vscodeApi from '../vscode.js'
import { Messenger } from '../Messenger'

import { resultCreateNewComponent } from './stores/breadboard'

const messenger = new Messenger()

interface IRenameComponentPayload {
    before: string,
    after: string,
}

const extension = {
    showMessage(text: string): void {
        messenger.postVoidPayload('showMessage', text)
    },
    update(breadboard): void {
        messenger.postVoidPayload('update', breadboard)
    },
    renameComponent(payload: IRenameComponentPayload): void {
        messenger.postVoidPayload('renameComponent', payload)
    },
    async createNewComponent(): Promise<{ templateImport:object, component:object }> {
        return messenger.postRequestPayload('createNewComponent', null)
    },
}

const webview = {
    hydrate(breadboard): void {
        resultCreateNewComponent.set(breadboard)
    },
}

messenger.applyReceivedMessagesTo(webview)
messenger.sendMessagesTo(vscodeApi)
messenger.subscribe()

export { extension }
