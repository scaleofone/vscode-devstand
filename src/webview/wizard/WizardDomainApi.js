class WizardDomainApi {
    constructor(win) {
        this.parent = win
        this.requestIdSequence = 1;
    }
    postMessage(payload) {
        console.warn('direct access to vscode api')
    }

    info(text) {
        this.parent.postMessage({ command: 'info', text })
    }
    async requestListing(directory) {
        return this.postRequestPayload('requestListing', { directory })
    }
    async requestFindFiles(pattern) {
        return this.postRequestPayload('requestFindFiles', { pattern })
    }
    async postRequestPayload(command, payload) {
        return new Promise((resolve, reject) => {
            let __requestId = ++this.requestIdSequence
            let responseHandler = (event) => {
                if (event.data && event.data.__requestId === __requestId && event.data.__is === 'response') {
                    window.removeEventListener('message', responseHandler)
                    resolve(event.data.payload)
                }
            }
            window.addEventListener('message', responseHandler)
            this.parent.postMessage({ command, payload, __requestId })
        })
    }
}

export default WizardDomainApi
