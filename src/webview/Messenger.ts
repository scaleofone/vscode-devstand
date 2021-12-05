interface MessengerMessage {
    is: 'void' | 'request' | 'response'
    from: 'webview' | 'extension'
    requestId?: number
    payload?: any
    command?: string
}

class Messenger {
    requestIdSequence: number = 1

    private facade: object
    applyReceivedMessagesTo(facade: object) {
        this.facade = facade
    }

    private sender: { postMessage:Function }
    sendMessagesTo(sender: { postMessage:Function }) {
        this.sender = sender
    }

    subscribe() {
        window.addEventListener('message', (event: MessageEvent) => this.onDidReceiveMessage(event.data))
    }

    onDidReceiveMessage(message: MessengerMessage) {
        if (message.is == 'void' && message.from === 'extension') {
            this.facade[message.command].apply(this.facade, [message.payload])
        } else if (message.is == 'request' && message.from === 'extension') {
            this.facade[message.command].apply(this.facade, [message.payload])
                .then(responseFromFacade => {
                    this.sender.postMessage({
                        is: 'response',
                        from: 'webview',
                        requestId: message.requestId,
                        payload: responseFromFacade
                    })
                })
        }
    }

    postVoidPayload(command: string, payload: any): void {
        this.sender.postMessage({ is: 'void', from: 'webview', command, payload })
    }

    async postRequestPayload(command: string, payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let requestId = ++this.requestIdSequence
            let responseHandler = (event: MessageEvent) => {
                let message: MessengerMessage = event.data
                if (message && message.requestId === requestId && message.is === 'response' && message.from === 'extension') {
                    this.removeListener(responseHandler)
                    resolve(message.payload)
                }
            }
            window.addEventListener('message', responseHandler)
            this.sender.postMessage({ is: 'request', from: 'webview', command, payload, requestId })
        })
    }

    private removeListener(responseHandler) {
        window.removeEventListener('message', responseHandler)
    }
}

export { Messenger }