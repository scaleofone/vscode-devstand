import vscodeApi from '../vscode.js'
import { listing } from './stores/listing.js'
import { get_store_value } from 'svelte/internal'

class KickerFacade {

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

    truncateListing(count) {
        listing.truncate(count)
        return Promise.resolve(get_store_value(listing).length)
    }

    resetListing() {
        listing.reset()
    }
}

export default new KickerFacade()
export { KickerFacade }
