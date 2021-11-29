import { writable, derived } from 'svelte/store'
import domainApi from './../WizardDomainApi.js'

export const listingPromise = writable(null)

export const listing = (() => {
    const { subscribe, set, update } = writable([])
    return {
        subscribe,

        reset: () => {
            listingPromise.set(null)
            set([])
        },

        truncate: (count) => update(arr => {
            arr.splice(0, count)
            return arr
        }),

        requestDirectory: (directory) => {
            listingPromise.set(
                domainApi.requestListing(directory)
                    .then(payload => set(payload))
            )
        },

        requestFindFiles: (pattern) => {
            listingPromise.set(
                domainApi.requestFindFiles(pattern)
                    .then(payload => set(payload))
            )
        },
    }
})()

export const listingAsString = derived(
    listing,
    $listing => $listing.length ? $listing.join("\n") : 'no items'
)
