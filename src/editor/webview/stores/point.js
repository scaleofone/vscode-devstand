import { writable } from 'svelte/store'
import { get_store_value } from 'svelte/internal'
import { extension } from '../transport'
import { debounce } from 'throttle-debounce'

export const justHydrated = writable(false)

export const top = writable(0)
export const left = writable(0)

export const recenter = () => {
    top.set(100)
    left.set(100)
}

const updateDocumentActually = debounce(2000, () => {
    extension.showMessage('UPDATE DOCUMENT')
    extension.update(
        [get_store_value(top), get_store_value(left)]
    )
})
export const updateDocument = () => {
    if (get_store_value(justHydrated)) {
        justHydrated.set(false)
        return
    }
    updateDocumentActually()
}
