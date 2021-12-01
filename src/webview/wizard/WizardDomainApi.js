import vscodeApi from '../vscode.js'

class WizardDomainApi {
    constructor() {
        this.requestIdSequence = 1;
    }

    /************** Pass commands to webview **************/

    saveSnippets() {
        this.postVoidPayload('saveSnippets', null)
    }

    showMessage(text) {
        this.postVoidPayload('showMessage', text)
    }


    /********************* Messenger **********************/

    postVoidPayload(command, payload) {
        vscodeApi.postMessage({ __is: 'void', __from: 'webview', command, payload })
    }

    async postRequestPayload(command, payload) {
        return new Promise((resolve, reject) => {
            let __requestId = ++this.requestIdSequence
            let responseHandler = (event) => {
                if (event.data && event.data.__requestId === __requestId && event.data.__is === 'response' && event.data.__from === 'domain') {
                    window.removeEventListener('message', responseHandler)
                    resolve(event.data.payload)
                }
            }
            window.addEventListener('message', responseHandler)
            vscodeApi.postMessage({ __is: 'request', __from: 'webview', command, payload, __requestId })
        })
    }
}

export default new WizardDomainApi()
export { WizardDomainApi }
