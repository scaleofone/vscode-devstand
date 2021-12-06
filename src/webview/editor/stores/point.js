import { writable } from 'svelte/store'

export const top = writable(0)
export const left = writable(0)

export const recenter = () => {
    top.set(100)
    left.set(100)
}
