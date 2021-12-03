import { getFileContent, filesToSave } from './stores/snippets.js'
import { get_store_value } from 'svelte/internal'
import { WizardExtensionGateway } from './WizardExtensionGateway'

class WizardWebviewFacade {
    private gateway: WizardExtensionGateway
    constructor(gateway: WizardExtensionGateway) {
        this.gateway = gateway
    }

    /************** Handle commands passed from extension **************/

    getFilesToSave(): Promise<string[]> {
        return Promise.resolve(get_store_value(filesToSave))
    }

    getFileContent(filename: string): Promise<string> {
        return Promise.resolve(getFileContent(filename))
    }
}

export { WizardWebviewFacade }
