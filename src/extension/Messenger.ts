import vscode from 'vscode'

interface MessengerMessage {
    __is: string
    __from: string
    __requestId?: number
    payload?: any
    command?: string
}

class Messenger {
    requestIdSequence: number = 1

    private disposables: vscode.Disposable[]
    constructor(disposables: vscode.Disposable[]) {
        this.disposables = disposables
    }

    private facade: object
    applyMessagesTo(facade: object) {
        this.facade = facade
    }

    private receiver: { postMessage:Function }
    postMessagesVia(receiver: { postMessage:Function }) {
        this.receiver = receiver
    }

    private disposer: { onDidReceiveMessage:Function }
    subscribeVia(disposer: { onDidReceiveMessage:Function }) {
        this.disposer = disposer
    }

    subscribe() {
        this.disposer.onDidReceiveMessage(this.onDidReceiveMessage, this, this.disposables)
    }

    onDidReceiveMessage(message: MessengerMessage) {
        if (message.__is == 'void' && message.__from === 'webview') {
            this.facade[message.command].apply(this.facade, [message.payload])
        } else if (message.__is == 'request' && message.__from === 'webview') {
            this.facade[message.command].apply(this.facade, [message.payload])
                .then(responseFromFacade => {
                    this.receiver.postMessage({
                        __is: 'response',
                        __from: 'domain',
                        __requestId: message.__requestId,
                        payload: responseFromFacade
                    })
                })
        }
    }

    postVoidPayload(command: string, payload: any): void {
        this.receiver.postMessage({ __is: 'void', __from: 'domain', command, payload })
    }

    async postRequestPayload(command: string, payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let __requestId = ++this.requestIdSequence
            let disposable = this.disposer.onDidReceiveMessage((message: MessengerMessage) => {
                if (message.__requestId === __requestId && message.__is === 'response' && message.__from === 'webview') {
                    let givenDisposableIndex = this.disposables.findIndex(given => given === disposable)
                    if (givenDisposableIndex > -1) {
                        this.disposables[givenDisposableIndex].dispose()
                        this.disposables.splice(givenDisposableIndex, 1)
                    }
                    resolve(message.payload)
                }
            }, this, this.disposables)
            this.receiver.postMessage({ __is: 'request', __from: 'domain', command, payload, __requestId })
        })
    }
}

export { Messenger }
