import { MessengerContext } from './shared'

class KickerExtensionGateway {
    context: MessengerContext
    constructor(context: MessengerContext) {
        this.context = context
    }

    /************** Pass commands to extension **************/

    showMessage(text: string): void {
        this.context.messenger.postVoidPayload('showMessage', text)
    }

    async requestListing(directory: string): Promise<string[]> {
        return this.context.messenger.postRequestPayload('requestListing', directory)
    }

    async requestFindFiles(pattern: string | { pattern:string, exclude?:string }): Promise<string[]> {
        return this.context.messenger.postRequestPayload('requestFindFiles', pattern)
    }

}

export { KickerExtensionGateway }
