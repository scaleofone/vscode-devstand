import { Messenger } from './Messenger'

class KickerWebviewGateway {
    private messenger: Messenger
    constructor(messenger: Messenger) {
        this.messenger = messenger
    }

    /************** Pass commands to webview **************/

    resetListing(): void {
        this.messenger.postVoidPayload('resetListing', null)
    }

    async truncateListing(count: number): Promise<number> {
        return this.messenger.postRequestPayload('truncateListing', count)
    }

    async getFilesToSave(): Promise<string[]> {
        return this.messenger.postRequestPayload('getFilesToSave', null)
    }

    async getFileContent(filename: string): Promise<string> {
        return this.messenger.postRequestPayload('getFileContent', filename)
    }
}

export { KickerWebviewGateway }
