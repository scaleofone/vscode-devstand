import { VsCodeApi } from '../vscode.js'
import { Messenger } from './Messenger'

interface MessengerMessage {
    __is: string
    __from: string
    __requestId?: number
    payload?: any
    command?: string
}

interface MessengerContext {
    messenger: Messenger
    gateway
    facade
}

interface WebviewMessengerContext extends MessengerContext {
    vscodeApi: VsCodeApi
}

interface ExtensionMessengerContext extends MessengerContext {

}

export { MessengerMessage, MessengerContext, WebviewMessengerContext, ExtensionMessengerContext }
