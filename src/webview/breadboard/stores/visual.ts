import { Writable, writable, get } from 'svelte/store'

export const zoom: Writable<number> = writable(1)
