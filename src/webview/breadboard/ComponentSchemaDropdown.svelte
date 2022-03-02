<script>
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
    import { get } from 'svelte/store'
    import { records, templateImports, schemaDictionary } from './stores/breadboard'
    import DetailDropdown from './controls/DetailDropdown'
    import iconSchema from '@vscode/codicons/src/icons/code.svg'

    export let component

    $: componentRecords = $records.filter(r => r.componentIdentifier == component.identifier)
    $: componentRecordsIdentifiers = componentRecords.map(r => r.identifier)
    $: templateImport = component ? get(templateImports).find(ti => ti.variableName == component.templateImportVariableName) : undefined
    $: schemaDictionaryItem = templateImport ? get(schemaDictionary).find(dictItem => templateImport.targetFile == dictItem.targetFile && templateImport.targetIdentifier == dictItem.targetIdentifier) : undefined
    $: schema = schemaDictionaryItem ? schemaDictionaryItem.schema : undefined
    $: availableRecordIdentifiers = schema ? Object.keys(schema.properties) : []

    $: schemaDropdownItems = availableRecordIdentifiers.map(recordIdentifier => {
        return {
            recordIdentifier,
            alreadyAdded: componentRecordsIdentifiers.includes(recordIdentifier),
            recordSchema: (typeof schema == 'object' && typeof schema.properties == 'object' && typeof schema.properties[recordIdentifier] == 'object') ? schema.properties[recordIdentifier] : undefined,
        }
    })

    function addRecord({ recordIdentifier, alreadyAdded, recordSchema }) {
        if (alreadyAdded) return

        let type = (typeof recordSchema == 'object' && typeof recordSchema.type == 'string' && ['object', 'string', 'number'].includes(recordSchema.type.toLowerCase())) ? recordSchema.type.toLowerCase() : 'null'
        let value = (typeof recordSchema == 'object' && ['object', 'string', 'number'].includes(typeof recordSchema.default)) ? recordSchema.default : null

        let record = {
            componentIdentifier: component.identifier,
            scope: undefined, // TODO define scope while adding Records
            identifier: recordIdentifier,
            type,
            value,
            inSchema: true,
        }
        dispatch('addRecord', record)
    }
</script>

<details use:DetailDropdown class="dropdown select-none">
    <summary class="fg-icon hover:fg-link cursor-pointer">{@html iconSchema}</summary>
    <div class="menu menu--mono widget-shadow" style="max-width:300px">
        {#each schemaDropdownItems as item (item)}
            <div class="menu__item"
                class:alreadyAdded="{item.alreadyAdded}"
                on:click="{()=>addRecord(item)}"
            >
                <span class="grow truncate">{item.recordIdentifier}</span>
            </div>
        {/each}
    </div>
</details>

<style>
    .menu__item.alreadyAdded {
        color: #ccc;
    }
</style>
