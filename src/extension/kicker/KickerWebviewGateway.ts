import { Messenger } from '../Messenger'

class KickerWebviewGateway {
    private messenger: Messenger
    constructor(messenger: Messenger) {
        this.messenger = messenger
    }

    /************** Pass commands to webview **************/

    async truncateListing(count: number): Promise<number> {
        return this.messenger.postRequestPayload('truncateListing', count)
    }

    resetListing(): void {
        this.messenger.postVoidPayload('resetListing', null)
    }
}

export { KickerWebviewGateway }
