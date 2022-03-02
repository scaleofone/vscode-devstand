import { Writable, writable, get } from 'svelte/store'
import { TemplateSchemaDictionaryItem, TemplateImport, Component, Record } from '../../../BreadboardTypes'
import { extension } from '../transport'

export const schemaDictionary: Writable<TemplateSchemaDictionaryItem[]> = writable([])
export const templateImports: Writable<TemplateImport[]> = writable([])
export const components: Writable<Component[]> = writable([])
export const records: Writable<Record[]> = writable([])

export function mutateComponentGeometry(componentIdentifier: string, cornerY: number, cornerX: number): Component {
    console.log('mutateComponentGeometry', componentIdentifier, cornerY, cornerX)
    const component = mutateCollectionItem(components, 'identifier', componentIdentifier, { cornerY, cornerX }) as Component
    extension.mutateComponentGeometry({
        componentIdentifier: componentIdentifier,
        cornerY,
        cornerX,
        colorIndex: component.colorIndex,
    })
    return component
}

function mutateCollectionItem(store: Writable<object[]>, idAttr: string, idValue: string, data: object): object {
    let collection = get(store)
    let index = collection.findIndex(item => item[idAttr] === idValue)
    let item = collection[index]
    item = {...item, ...data}
    collection.splice(index, 1, item)
    store.set(collection)
    return item
}
