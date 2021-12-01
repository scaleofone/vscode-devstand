import vscodeApi from '../vscode.js'
import { Messenger } from './Messenger'
import { KickerExtensionGateway } from './KickerExtensionGateway'
import { KickerWebviewFacade } from './KickerWebviewFacade'

class KickerContext
{
    messenger: Messenger
    gateway: KickerExtensionGateway
    facade: KickerWebviewFacade

    private constructor() {
        this.messenger = new Messenger()
        this.gateway = new KickerExtensionGateway(this.messenger)
        this.facade = new KickerWebviewFacade(this.gateway)

        this.messenger.applyMessagesTo(this.facade)
        this.messenger.postMessagesVia(vscodeApi)
        this.messenger.subscribe()
    }

    private static instance: KickerContext | undefined
    public static singleton(): KickerContext {
        if (typeof KickerContext.instance == 'undefined') {
            KickerContext.instance = new KickerContext()
        }
        return KickerContext.instance
    }
}

const context = KickerContext.singleton()
const gateway = context.gateway
const messenger = context.messenger
const facade = context.facade

export { gateway, messenger, facade }
