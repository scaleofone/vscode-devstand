import vscode from 'vscode'

import { Messenger } from '../Messenger'
import { KickerExtensionFacade } from './KickerExtensionFacade'
import { KickerWebviewGateway } from './KickerWebviewGateway'

class KickerExtensionContext
{
    messenger: Messenger
    gateway: KickerWebviewGateway
    facade: KickerExtensionFacade

    constructor(webview: vscode.Webview, disposables: vscode.Disposable[]) {
        this.messenger = new Messenger(disposables)
        this.gateway = new KickerWebviewGateway(this.messenger)
        this.facade = new KickerExtensionFacade(this.gateway)

        this.messenger.applyReceivedMessagesTo(this.facade)
        this.messenger.receiveMessagesFrom(webview)
        this.messenger.sendMessagesTo(webview)
        this.messenger.subscribe()
    }
}

export { KickerExtensionContext }
