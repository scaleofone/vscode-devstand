import { writable } from 'svelte/store'
import { get_store_value } from 'svelte/internal'
import { extension } from '../transport'

export const top = writable(0)
export const left = writable(0)

export const recenter = () => {
    top.set(100)
    left.set(100)
}

export const updateDocument = () => {
    extension.update(
        [get_store_value(top), get_store_value(left)]
    )
}
