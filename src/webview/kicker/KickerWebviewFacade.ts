import { listing } from './stores/listing.js'
import { get_store_value } from 'svelte/internal'
import { MessengerContext } from './shared'

class KickerWebviewFacade {
    context: MessengerContext
    constructor(context: MessengerContext) {
        this.context = context
    }

    /************** Handle commands passed from extension **************/

    truncateListing(count: number): Promise<number> {
        listing.truncate(count)
        return Promise.resolve(get_store_value(listing).length)
    }

    resetListing(): void {
        listing.reset()
    }
}

export { KickerWebviewFacade }
