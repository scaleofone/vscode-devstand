import { derived, Readable, readable, Writable, writable, get } from 'svelte/store'
import { Base, bases } from './dictionaries'

const unique = (item: any, pos: number, self: any[]) => self.indexOf(item) == pos

export const selectedPhpVersion: Writable<string> = writable(undefined)
export const selectedBaseCaption: Writable<string> = writable(undefined)
export const selectedBaseTag: Writable<string> = writable(undefined)

export const availablePhpVersions: Readable<string[]> = readable(bases.map(b => b.phpVersion).filter(unique))

export const availableBaseCaptions: Readable<string[]> = derived(selectedPhpVersion, ($selectedPhpVersion) => {
    return bases.filter(b => b.phpVersion == $selectedPhpVersion).map(b => b.caption).filter(unique)
})

export const availableBaseTags: Readable<string[]> = derived([selectedPhpVersion, selectedBaseCaption], ([$selectedPhpVersion, $selectedBaseCaption]) => {
    return bases.filter(b => b.phpVersion == $selectedPhpVersion && b.caption == $selectedBaseCaption).map(b => b.tag).filter(unique)
})

export const selectedBase: Readable<Base> = derived([selectedPhpVersion, selectedBaseCaption, selectedBaseTag], ([$selectedPhpVersion, $selectedBaseCaption, $selectedBaseTag]) => {
    return bases.find(b => b.phpVersion == $selectedPhpVersion && b.caption == $selectedBaseCaption && b.tag == $selectedBaseTag)
})

export const detectedComposerModules: Writable<string[]> = writable(['dom','fileinfo','json','libxml','mbstring','openssl','pcre','simplexml','tokenizer'])

export const manualComposerModules: Readable<string[]> = readable(['iconv', 'pcntl'])

