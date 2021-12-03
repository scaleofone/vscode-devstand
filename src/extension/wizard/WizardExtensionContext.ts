import vscode from 'vscode'

import { Messenger } from '../Messenger'
import { WizardExtensionFacade } from './WizardExtensionFacade'
import { WizardWebviewGateway } from './WizardWebviewGateway'

class WizardExtensionContext
{
    messenger: Messenger
    gateway: WizardWebviewGateway
    facade: WizardExtensionFacade

    constructor(webview: vscode.Webview, disposables: vscode.Disposable[]) {
        this.messenger = new Messenger(disposables)
        this.gateway = new WizardWebviewGateway(this.messenger)
        this.facade = new WizardExtensionFacade(this.gateway)

        this.messenger.applyReceivedMessagesTo(this.facade)
        this.messenger.receiveMessagesFrom(webview)
        this.messenger.sendMessagesTo(webview)
        this.messenger.subscribe()
    }
}

export { WizardExtensionContext }
