import { Writable, writable, get } from 'svelte/store'
import { TemplateSchemaDictionaryItem, TemplateImport, Component, Record } from '../../../BreadboardTypes'

export const schemaDictionary: Writable<TemplateSchemaDictionaryItem[]> = writable([])
export const templateImports: Writable<TemplateImport[]> = writable([])
export const components: Writable<Component[]> = writable([])
export const records: Writable<Record[]> = writable([])

export function mutateComponent(componentIdentifier: string, data: object) {
    console.log('mutateComponent', componentIdentifier, data)
    mutateCollectionItem(components, 'identifier', componentIdentifier, data)
}

function mutateCollectionItem(store: Writable<object[]>, idAttr: string, idValue: string, data: object) {
    let collection = get(store)
    let index = collection.findIndex(item => item[idAttr] === idValue)
    let item = collection[index]
    item = {...item, ...data}
    collection.splice(index, 1, item)
    store.set(collection)
}
