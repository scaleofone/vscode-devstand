import { Writable, writable } from 'svelte/store'
import { TemplateSchemaDictionaryItem, TemplateImport, Component, Record } from '../../../BreadboardTypes'

export const schemaDictionary: Writable<TemplateSchemaDictionaryItem[]> = writable([])
export const templateImports: Writable<TemplateImport[]> = writable([])
export const components: Writable<Component[]> = writable([])
export const records: Writable<Record[]> = writable([])
