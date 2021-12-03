import vscodeApi from '../vscode.js'
import { Messenger } from '../Messenger'
import { KickerExtensionGateway } from './KickerExtensionGateway'
import { KickerWebviewFacade } from './KickerWebviewFacade'

class KickerWebviewContext
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

    private static instance: KickerWebviewContext | undefined
    public static singleton(): KickerWebviewContext {
        if (typeof KickerWebviewContext.instance == 'undefined') {
            KickerWebviewContext.instance = new KickerWebviewContext()
        }
        return KickerWebviewContext.instance
    }
}

const context = KickerWebviewContext.singleton()
const gateway = context.gateway

export { gateway }
