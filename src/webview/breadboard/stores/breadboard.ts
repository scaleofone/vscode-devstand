import { Writable, writable, get } from 'svelte/store'
import { TemplateSchemaDictionaryItem, TemplateImport, Component, Record } from '../../../BreadboardTypes'
import { extension } from '../transport'

export const schemaDictionary: Writable<TemplateSchemaDictionaryItem[]> = writable([])
export const templateImports: Writable<TemplateImport[]> = writable([])
export const components: Writable<Component[]> = writable([])
export const records: Writable<Record[]> = writable([])

export const recordPathsBeingEdited: Writable<string[]> = writable([])

export function mutateComponentGeometry(componentIdentifier: string, cornerY: number, cornerX: number): Component | undefined {
    const component = mutateCollectionItem(components, 'identifier', componentIdentifier, { cornerY, cornerX }) as Component
    if (! component) { return }
    console.log('mutateComponentGeometry', componentIdentifier, cornerY, cornerX)
    extension.mutateComponentGeometry({
        componentIdentifier: componentIdentifier,
        cornerY,
        cornerX,
        colorIndex: component.colorIndex,
    })
    return component
}

function mutateCollectionItem(store: Writable<object[]>, idAttr: string, idValue: string, data: object): object | undefined {
    let collection = get(store)
    let index = collection.findIndex(item => item[idAttr] === idValue)
    let item = collection[index]
    let updatedItem = {...item, ...data}
    if (JSON.stringify(item) === JSON.stringify(updatedItem)) { return }
    item = {...item, ...data}
    collection.splice(index, 1, item)
    store.set(collection)
    return item
}
