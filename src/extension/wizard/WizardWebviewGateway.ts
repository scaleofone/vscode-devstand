import { Messenger } from '../Messenger'

class WizardWebviewGateway {
    private messenger: Messenger
    constructor(messenger: Messenger) {
        this.messenger = messenger
    }

    /************** Pass commands to webview **************/

    async getFilesToSave(): Promise<string[]> {
        return this.messenger.postRequestPayload('getFilesToSave', null)
    }

    async getFileContent(filename: string): Promise<string> {
        return this.messenger.postRequestPayload('getFileContent', filename)
    }
}

export { WizardWebviewGateway }
