import vscode from 'vscode'

import { WizardWebviewGateway } from './WizardWebviewGateway'

class WizardExtensionFacade {
    private gateway: WizardWebviewGateway
    constructor(gateway: WizardWebviewGateway) {
        this.gateway = gateway
    }

    /************** Handle commands passed from extension **************/

    showMessage(payload: string) {
        vscode.window.showInformationMessage(payload)
    }

    async saveSnippets() {
        const filesToSave = await this.gateway.getFilesToSave()
        filesToSave.forEach(filename => {
            this.gateway.getFileContent(filename)
                .then(content => this.saveFile(filename, content))
        })
    }

    // TODO not related to the class
    private saveFile(filename: string, content: string) {
        vscode.window.showInformationMessage(filename)
    }
}

export { WizardExtensionFacade }
