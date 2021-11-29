import vscodeApi from '../vscode.js'

class WizardDomainApi {
    constructor() {
        this.requestIdSequence = 1;
    }

    /************** Pass commands to webview **************/

    showMessage(text) {
        this.postVoidPayload('showMessage', text)
    }

    async requestListing(directory) {
        return this.postRequestPayload('requestListing', directory)
    }

    async requestFindFiles(pattern) {
        return this.postRequestPayload('requestFindFiles', pattern)
    }

    postVoidPayload(command, payload) {
        vscodeApi.postMessage({ __is: 'void', command, payload })
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
            vscodeApi.postMessage({ __is: 'request', command, payload, __requestId })
        })
    }
}

export default new WizardDomainApi()
export { WizardDomainApi }
