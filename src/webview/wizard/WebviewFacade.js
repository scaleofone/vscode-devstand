import vscodeApi from '../vscode.js'

class WebviewFacade {

    /********************* Messenger **********************/

    constructor() {
        window.addEventListener('message', (event) => this.onDidReceiveMessage(event.data))
    }

    onDidReceiveMessage(message) {
        if (message.__is == 'void' && message.__from === 'domain') {
            this[message.command].apply(this, [message.payload])
        } else if (message.__is == 'request' && message.__from === 'domain') {
            this[message.command].apply(this, [message.payload])
                .then(responsePayload => {
                    vscodeApi.postMessage({
                        __is: 'response',
                        __from: 'webview',
                        __requestId: message.__requestId,
                        payload: responsePayload
                    })
                })
        }
    }

    /************** Handle commands passed from extension **************/

    // TBD
}

export default new WebviewFacade()
export { WebviewFacade }
