import vscodeApi from '../vscode.js'
import { Messenger } from '../Messenger'
import { WizardExtensionGateway } from './WizardExtensionGateway'
import { WizardWebviewFacade } from './WizardWebviewFacade'

class WizardWebviewContext
{
    messenger: Messenger
    gateway: WizardExtensionGateway
    facade: WizardWebviewFacade

    private constructor() {
        this.messenger = new Messenger()
        this.gateway = new WizardExtensionGateway(this.messenger)
        this.facade = new WizardWebviewFacade(this.gateway)

        this.messenger.applyMessagesTo(this.facade)
        this.messenger.postMessagesVia(vscodeApi)
        this.messenger.subscribe()
    }

    private static instance: WizardWebviewContext | undefined
    public static singleton(): WizardWebviewContext {
        if (typeof WizardWebviewContext.instance == 'undefined') {
            WizardWebviewContext.instance = new WizardWebviewContext()
        }
        return WizardWebviewContext.instance
    }
}

const context = WizardWebviewContext.singleton()
const gateway = context.gateway

export { gateway }
