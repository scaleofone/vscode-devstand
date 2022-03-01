import { Writable, writable } from 'svelte/store'
import { Square } from './visual'
import { TemplateSchemaDictionaryItem, TemplateImport, Component, Record } from '../../../BreadboardTypes'

export const schemaDictionary: Writable<TemplateSchemaDictionaryItem[]> = writable([])
export const templateImports: Writable<TemplateImport[]> = writable([])
export const components: Writable<Component[]> = writable([])
export const records: Writable<Record[]> = writable([])

export function updateSquareStyle(payload: Square) {
    console.log('updateSquareStyle', payload)
}
