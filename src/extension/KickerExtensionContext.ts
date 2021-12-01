import vscode from 'vscode'

import { Messenger } from './Messenger'
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

        this.messenger.applyMessagesTo(this.facade)
        this.messenger.postMessagesVia(webview)
        this.messenger.subscribeVia(webview)
        this.messenger.subscribe()
    }
}

export { KickerExtensionContext }
