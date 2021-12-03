import { Messenger } from '../Messenger'

class WizardExtensionGateway {
    private messenger: Messenger
    constructor(messenger: Messenger) {
        this.messenger = messenger
    }

    /************** Pass commands to extension **************/

    showMessage(text: string): void {
        this.messenger.postVoidPayload('showMessage', text)
    }

    saveSnippets(): void {
        this.messenger.postVoidPayload('saveSnippets', null)
    }
}

export { WizardExtensionGateway }
