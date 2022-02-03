<script>
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
    import { get } from 'svelte/store'
    import { components, records, templateImports, schemaDictionary } from './stores/breadboard'
    import DetailDropdown from './controls/DetailDropdown'
    import iconSchema from '@vscode/codicons/src/icons/code.svg'

    export let identifier

    $: component = $components.find(c => c.identifier == identifier)
    $: componentRecords = $records.filter(r => r.componentIdentifier == identifier)
    $: componentRecordsIdentifiers = componentRecords.map(r => r.identifier)
    $: templateImport = component ? get(templateImports).find(ti => ti.variableName == component.templateImportVariableName) : undefined
    $: schema = templateImport ? get(schemaDictionary).find(dictItem => templateImport.targetFile == dictItem.targetFile && templateImport.targetIdentifier == dictItem.targetIdentifier).schema : undefined
    $: availableRecordIdentifiers = schema ? Object.keys(schema.properties) : []
    $: schemaDropdownOptions = availableRecordIdentifiers.map(i => (componentRecordsIdentifiers.includes(i) ? '-' : '+')+' '+i)

</script>

<details use:DetailDropdown class="dropdown inline-block">
    <summary class="fg-icon hover:fg-link cursor-pointer">{@html iconSchema}</summary>
    <div class="menu menu--mono widget-shadow" style="max-width:300px">
        {#each schemaDropdownOptions as caption}
            <div class="menu__item"><span class="grow truncate">{caption}</span></div>
        {/each}
    </div>
</details>
