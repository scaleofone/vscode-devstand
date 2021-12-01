import { MessengerMessage, WebviewMessengerContext } from './shared'

class Messenger {
    context: WebviewMessengerContext

    requestIdSequence: number = 1

    constructor(context: WebviewMessengerContext) {
        this.context = context
    }

    subscribe() {
        window.addEventListener('message', (event: MessageEvent) => this.onDidReceiveMessage(event.data))
    }

    private postMessage(message: MessengerMessage) {
        this.context.vscodeApi.postMessage(message)
    }

    private onDidReceiveMessage(message: MessengerMessage) {
        if (message.__is == 'void' && message.__from === 'domain') {
            this.context.facade[message.command].apply(this.context.facade, [message.payload])
        } else if (message.__is == 'request' && message.__from === 'domain') {
            this.context.facade[message.command].apply(this.context.facade, [message.payload])
                .then(responseFromFacade => {
                    this.postMessage({
                        __is: 'response',
                        __from: 'webview',
                        __requestId: message.__requestId,
                        payload: responseFromFacade
                    })
                })
        }
    }

    postVoidPayload(command: string, payload: any): void {
        this.postMessage({ __is: 'void', __from: 'webview', command, payload })
    }

    async postRequestPayload(command: string, payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let __requestId = ++this.requestIdSequence
            let responseHandler = (event: MessageEvent) => {
                const message: MessengerMessage = event.data
                if (message && message.__requestId === __requestId && message.__is === 'response' && message.__from === 'domain') {
                    window.removeEventListener('message', responseHandler)
                    resolve(message.payload)
                }
            }
            window.addEventListener('message', responseHandler)
            this.postMessage({ __is: 'request', __from: 'webview', command, payload, __requestId })
        })
    }
}

export { Messenger }
