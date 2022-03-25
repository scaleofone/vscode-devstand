import { writable, derived } from 'svelte/store'
import { extension } from '../transport'

export const listingPromise = writable(null)

export const listing = (() => {
    const { subscribe, set, update } = writable([])
    return {
        subscribe,

        reset: () => {
            listingPromise.set(null)
            set([])
        },

        truncate: (count: number) => update(arr => {
            arr.splice(0, count)
            return arr
        }),

        requestDirectory: (directory: string) => {
            listingPromise.set(
                extension.requestListing(directory)
                    .then(payload => set(payload))
            )
        },

        requestFindFiles: (pattern: string | { pattern:string, exclude?:string }) => {
            listingPromise.set(
                extension.requestFindFiles(pattern)
                    .then(payload => set(payload))
            )
        },
    }
})()

export const listingAsString = derived(
    listing,
    $listing => $listing.length ? $listing.join("\n") : 'no items'
)