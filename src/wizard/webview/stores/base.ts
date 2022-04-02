import { derived, Readable, readable, Writable, writable, get } from 'svelte/store'
import { Base, bases, basesOrder } from './dictionaries'

const unique = (item: any, pos: number, self: any[]) => self.indexOf(item) == pos
const sortByOrder = (ordered: string[]) => (a: any, b: any) => ordered.indexOf(a) - ordered.indexOf(b)

export const selectedPhpVersion: Writable<string> = writable(undefined)
export const selectedBaseCaption: Writable<string> = writable(undefined)
export const selectedBaseTag: Writable<string> = writable(undefined)

export const availablePhpVersions: Readable<string[]> = readable(bases.map(b => b.phpVersion).filter(unique))

export const availableBaseCaptions: Readable<string[]> = derived(selectedPhpVersion, ($selectedPhpVersion) => {
    return bases.filter(b => b.phpVersion == $selectedPhpVersion).map(b => b.caption).filter(unique).sort(sortByOrder(basesOrder))
})

export const availableBaseTags: Readable<string[]> = derived([selectedPhpVersion, selectedBaseCaption], ([$selectedPhpVersion, $selectedBaseCaption]) => {
    return bases.filter(b => b.phpVersion == $selectedPhpVersion && b.caption == $selectedBaseCaption).map(b => b.tag).filter(unique)
})

export const selectedBase: Readable<Base> = derived([selectedPhpVersion, selectedBaseCaption, selectedBaseTag], ([$selectedPhpVersion, $selectedBaseCaption, $selectedBaseTag]) => {
    return bases.find(b => b.phpVersion == $selectedPhpVersion && b.caption == $selectedBaseCaption && b.tag == $selectedBaseTag)
})

// DEMO
selectedPhpVersion.set('7.4')
// selectedBaseCaption.set(bases[0].caption)
// selectedBaseTag.set(bases[0].tag)
