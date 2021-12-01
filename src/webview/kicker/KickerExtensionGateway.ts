import { Messenger } from './Messenger'

class KickerExtensionGateway {
    private messenger: Messenger
    constructor(messenger: Messenger) {
        this.messenger = messenger
    }

    /************** Pass commands to extension **************/

    showMessage(text: string): void {
        this.messenger.postVoidPayload('showMessage', text)
    }

    async requestListing(directory: string): Promise<string[]> {
        return this.messenger.postRequestPayload('requestListing', directory)
    }

    async requestFindFiles(pattern: string | { pattern:string, exclude?:string }): Promise<string[]> {
        return this.messenger.postRequestPayload('requestFindFiles', pattern)
    }

}

export { KickerExtensionGateway }
