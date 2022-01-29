import { writable } from 'svelte/store'
import { extension } from '../transport'

export const resultCreateNewComponent = writable({})

export const createNewComponent = () => {
    extension.createNewComponent().then(r => resultCreateNewComponent.set(r))
}
