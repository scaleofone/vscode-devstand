interface MessengerMessage {
    __is: string
    __from: string
    __requestId?: number
    payload?: any
    command?: string
}

class Messenger {
    requestIdSequence: number = 1

    private facade: object
    applyMessagesTo(facade: object) {
        this.facade = facade
    }

    private receiver: { postMessage:Function }
    postMessagesVia(receiver: { postMessage:Function }) {
        this.receiver = receiver
    }

    subscribe() {
        window.addEventListener('message', (event: MessageEvent) => this.onDidReceiveMessage(event.data))
    }

    private onDidReceiveMessage(message: MessengerMessage) {
        if (message.__is == 'void' && message.__from === 'domain') {
            this.facade[message.command].apply(this.facade, [message.payload])
        } else if (message.__is == 'request' && message.__from === 'domain') {
            this.facade[message.command].apply(this.facade, [message.payload])
                .then(responseFromFacade => {
                    this.receiver.postMessage({
                        __is: 'response',
                        __from: 'webview',
                        __requestId: message.__requestId,
                        payload: responseFromFacade
                    })
                })
        }
    }

    postVoidPayload(command: string, payload: any): void {
        this.receiver.postMessage({ __is: 'void', __from: 'webview', command, payload })
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
            this.receiver.postMessage({ __is: 'request', __from: 'webview', command, payload, __requestId })
        })
    }
}

export { Messenger }
