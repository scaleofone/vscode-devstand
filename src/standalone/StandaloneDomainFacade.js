const vscodeApi = {
    postMessage: (data) => {
        window.postMessage(data)
    }
}

class StandaloneDomainFacade {
    constructor() {
        this.requestIdSequence = 9000;
        window.addEventListener('message', (event) => this.onDidReceiveMessage(event.data))
        window.StandaloneDomainFacadeInstance = this
    }

    onDidReceiveMessage(message) {
        if (message.is == 'void' && message.from === 'webview') {
            this[message.command].apply(this, [message.payload])
        } else if (message.is == 'request' && message.from === 'webview') {
            this[message.command].apply(this, [message.payload])
                .then(responsePayload => {
                    vscodeApi.postMessage({
                        is: 'response',
                        from: 'extension',
                        requestId: message.requestId,
                        payload: responsePayload
                    })
                })
        }
    }

    postVoidPayload(command, payload) {
        vscodeApi.postMessage({ is: 'void', from: 'extension', command, payload })
    }

    async postRequestPayload(command, payload) {
        return new Promise((resolve, reject) => {
            let requestId = ++this.requestIdSequence
            let responseHandler = (event) => {
                if (event.data && event.data.requestId === requestId && event.data.is === 'response' && event.data.from === 'webview') {
                    window.removeEventListener('message', responseHandler)
                    resolve(event.data.payload)
                }
            }
            window.addEventListener('message', responseHandler)
            vscodeApi.postMessage({ is: 'request', from: 'extension', command, payload, requestId })
        })
    }

    /************** Handle commands passed from webview **************/

    showMessage(payload) {
        new Notification('showInformationMessage', {
            body: payload,
        })
    }

    async requestListing(directory) {
        return fetch('/backend/requestListing.php?directory='+directory)
            .then(res => res.json())
    }

    async requestFindFiles(pattern) {
        return fetch('/backend/requestFindFiles.php', { method: 'POST', body: JSON.stringify(pattern) })
            .then(res => res.json())
    }

    async saveSnippets() {
        const filesToSave = await this.postRequestPayload('getFilesToSave', null)
        if (Array.isArray(filesToSave)) {
            filesToSave.forEach(filename => {
                this.postRequestPayload('getFileContent', filename)
                    .then(content => this.saveFile(filename, content))
            })
        }
    }

    saveFile(filename, content) {
        this.showMessage(filename)
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
