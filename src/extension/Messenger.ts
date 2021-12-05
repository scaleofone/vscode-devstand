import vscode from 'vscode'

interface MessengerMessage {
    is: 'void' | 'request' | 'response'
    from: 'webview' | 'extension'
    requestId?: number
    payload?: any
    command?: string
}

class Messenger {
    requestIdSequence: number = 1

    private disposables: vscode.Disposable[] = []

    private facade: object | undefined
    applyReceivedMessagesTo(facade: object) {
        this.facade = facade
    }

    private sender: { postMessage:Function } | undefined
    sendMessagesTo(sender: { postMessage:Function }) {
        this.sender = sender
    }

    private receiver: { onDidReceiveMessage:Function } | undefined
    receiveMessagesFrom(receiver: { onDidReceiveMessage:Function }) {
        this.receiver = receiver
    }

    subscribe() {
        this.receiver.onDidReceiveMessage(this.onDidReceiveMessage, this, this.disposables)
    }

    dispose() {
        while (this.disposables.length) {
            const x = this.disposables.pop()
            if (x) {
                x.dispose()
            }
        }
    }

    onDidReceiveMessage(message: MessengerMessage) {
        if (message.is == 'void' && message.from === 'webview') {
            this.facade[message.command].apply(this.facade, [message.payload])
        } else if (message.is == 'request' && message.from === 'webview') {
            this.facade[message.command].apply(this.facade, [message.payload])
                .then(responseFromFacade => {
                    this.sender.postMessage({
                        is: 'response',
                        from: 'extension',
                        requestId: message.requestId,
                        payload: responseFromFacade
                    })
                })
        }
    }

    postVoidPayload(command: string, payload: any): void {
        this.sender.postMessage({ is: 'void', from: 'extension', command, payload })
    }

    async postRequestPayload(command: string, payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let requestId = ++this.requestIdSequence
            let disposable = this.receiver.onDidReceiveMessage((message: MessengerMessage) => {
                if (message.requestId === requestId && message.is === 'response' && message.from === 'webview') {
                    this.removeListener(disposable)
                    resolve(message.payload)
                }
            }, this, this.disposables)
            this.sender.postMessage({ is: 'request', from: 'extension', command, payload, requestId })
        })
    }

    private removeListener(disposable: vscode.Disposable) {
        let givenDisposableIndex = this.disposables.findIndex(given => given === disposable)
        if (givenDisposableIndex > -1) {
            this.disposables[givenDisposableIndex].dispose()
            this.disposables.splice(givenDisposableIndex, 1)
        }
    }
}

export { Messenger }
