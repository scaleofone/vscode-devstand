import { listing } from './stores/listing.js'
import { get_store_value } from 'svelte/internal'
import { KickerExtensionGateway } from './KickerExtensionGateway'

class KickerWebviewFacade {
    private gateway: KickerExtensionGateway
    constructor(gateway: KickerExtensionGateway) {
        this.gateway = gateway
    }

    /************** Handle commands passed from extension **************/

    async truncateListing(count: number): Promise<number> {
        listing.truncate(count)
        return Promise.resolve(get_store_value(listing).length)
    }

    resetListing(): void {
        listing.reset()
    }
}

export { KickerWebviewFacade }
