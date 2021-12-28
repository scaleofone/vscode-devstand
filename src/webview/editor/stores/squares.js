import { writable } from 'svelte/store'
import { extension } from '../transport'

export const resultNewSquare = writable({})

export const askForNewSquare = () => {
    extension.askForNewSquare().then(r => resultNewSquare.set(r))
}
