<script>
    import { get } from 'svelte/store'
    import { records, templateImports, schemaDictionary, recordPathsBeingEdited } from './stores/breadboard'
    import { makeUnPersistedRecordsForSchema } from './stores/persist'
    import { focusedEditorRecordPath } from './stores/visual'
    import DetailDropdown from './controls/DetailDropdown'
    import iconSchema from '@vscode/codicons/src/icons/add.svg'

    /** @type {import('../../BreadboardTypes').Component} */
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
        let multipleRecords = makeUnPersistedRecordsForSchema(component.identifier, recordIdentifier, alreadyAdded, recordSchema)
        if (multipleRecords.length == 0) { return }
        let trailingRecord = multipleRecords[multipleRecords.length-1]
        recordPathsBeingEdited.update((paths) => [...paths, trailingRecord.path])
        focusedEditorRecordPath.set(trailingRecord.path)
        records.update((recs) => [...recs, ...multipleRecords])
    }
</script>

<details use:DetailDropdown class="dropdown select-none dropdown--having-svg-in-summary">
    <summary class="cursor-pointer">{@html iconSchema}</summary>
    <div class="menu menu--vertical-padding widget-shadow" style="max-width:300px">
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
