import { VsCodeApi } from '../vscode.js'
import vscodeApi from '../vscode.js'
import { Messenger } from './Messenger'
import { WebviewMessengerContext } from './shared'
import { KickerExtensionGateway } from './KickerExtensionGateway'
import { KickerWebviewFacade } from './KickerWebviewFacade'

class KickerContext implements WebviewMessengerContext
{
    messenger: Messenger
    vscodeApi: VsCodeApi
    gateway: KickerExtensionGateway
    facade: KickerWebviewFacade

    constructor() {
        this.vscodeApi = vscodeApi
        this.gateway = new KickerExtensionGateway(this)
        this.facade = new KickerWebviewFacade(this)
        this.messenger = new Messenger(this)
        this.messenger.subscribe()
    }
}

export default new KickerContext()
