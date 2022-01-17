import vscodeApi from '../vscode.js'
import { Messenger } from '../Messenger'

import { resultCreateNewComponent } from './stores/breadboard'
import { RenameComponent, AddTemplateImport, RemoveTemplateImport, RemoveComponent } from '../../TransportPayloads.js'

const messenger = new Messenger()


const extension = {
    showMessage(text: string): void {
        messenger.postVoidPayload('showMessage', text)
    },
    update(breadboard): void {
        messenger.postVoidPayload('update', breadboard)
    },
    renameComponent(payload: RenameComponent): void {
        messenger.postVoidPayload('renameComponent', payload)
    },
    addTemplateImport(payload: AddTemplateImport): void {
        messenger.postVoidPayload('addTemplateImport', payload)
    },
    removeTemplateImport(payload: RemoveTemplateImport): void {
        messenger.postVoidPayload('removeTemplateImport', payload)
    },
    removeComponent(payload: RemoveComponent): void {
        messenger.postVoidPayload('removeComponent', payload)
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
