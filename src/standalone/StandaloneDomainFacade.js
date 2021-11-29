const vscodeApi = {
    postMessage: (data) => {
        window.postMessage(data)
    }
}

class StandaloneDomainFacade {
    constructor() {
        this.requestIdSequence = 9000;
        window.addEventListener('message', (event) => this.onDidReceiveMessage(event.data))
    }

    onDidReceiveMessage(message) {
        if (message.__is == 'void' && message.__from === 'webview') {
            this[message.command].apply(this, [message.payload])
        } else if (message.__is == 'request' && message.__from === 'webview') {
            this[message.command].apply(this, [message.payload])
                .then(responsePayload => {
                    vscodeApi.postMessage({
                        __is: 'response',
                        __from: 'domain',
                        __requestId: message.__requestId,
                        payload: responsePayload
                    })
                })
        }
    }

    postVoidPayload(command, payload) {
        vscodeApi.postMessage({ __is: 'void', __from: 'domain', command, payload })
    }

    async postRequestPayload(command, payload) {
        return new Promise((resolve, reject) => {
            let __requestId = ++this.requestIdSequence
            let responseHandler = (event) => {
                if (event.data && event.data.__requestId === __requestId && event.data.__is === 'response' && event.data.__from === 'webview') {
                    window.removeEventListener('message', responseHandler)
                    resolve(event.data.payload)
                }
            }
            window.addEventListener('message', responseHandler)
            vscodeApi.postMessage({ __is: 'request', __from: 'domain', command, payload, __requestId })
        })
    }

    /************** Handle commands passed from webview **************/

    showMessage(payload) {
        new Notification('showInformationMessage', {
            body: payload,
        })
    }

    async requestListing(directory) {
        return fetch('backend/requestListing.php?directory='+directory)
            .then(res => res.json())
    }

    async requestFindFiles(pattern) {
        console.error('not implemented yet!')
        return Promise.resolve([])
    }


    /************** Pass commands to webview **************/

    resetListing() {
        this.postVoidPayload('resetListing', null)
    }
    truncateListing() {
        this.postRequestPayload('truncateListing', 3)
            .then(responsePayload => this.showMessage(responsePayload.toString()))
    }
}

export default new StandaloneDomainFacade()
export { StandaloneDomainFacade }
