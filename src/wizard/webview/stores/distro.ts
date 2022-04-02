import { derived, Readable, readable, Writable, writable, get } from 'svelte/store'

export const workspaceFolderPath: Writable<string> = writable(undefined)

export const openedFromFolderPath: Writable<string> = writable(undefined)

export function performSave() {
    console.log('Saving!!!')
}
