import vscodeApi from '../vscode.js'

class WizardDomainApi {
    constructor() {
        this.requestIdSequence = 1;
    }
    postMessage(payload) {
        console.warn('direct access to vscode api')
    }

    info(text) {
        vscodeApi.postMessage({ command: 'info', text })
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
            vscodeApi.postMessage({ command, payload, __requestId })
        })
    }
}

export default new WizardDomainApi()
export { WizardDomainApi }
