<script>
    import { get } from 'svelte/store'
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    import { records, templateImports, schemaDictionary, recordPathsBeingEdited } from './stores/breadboard'
    import { makeUnPersistedRecordsForSchema } from './stores/persist'
    import { focusedEditorRecordPath } from './stores/visual'
    import DetailDropdown from './controls/DetailDropdown'
    import iconSchema from '@vscode/codicons/src/icons/ellipsis.svg'

    import { extension } from './transport'

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

    let canDelete = true
    $: canReveal = 'vscodeRange' in component
    function reveal() {
        extension.openDocument({
            preserveFocus: false,
            preview: false,
            selection: component.vscodeRange,
            viewColumn: 'Beside',
        })
    }

    let helpTitle
    let helpDescription
    let helpOffsetTop = 0
    function onSchemaItemMouseEnter(event, item) {
        helpOffsetTop = event.target.offsetTop
        helpTitle = item.recordSchema.title
        helpDescription = item.recordSchema.description
    }
    function onSchemaItemMouseLeave() {
        helpTitle = undefined
        helpDescription = undefined
        helpOffsetTop = 0
    }

</script>

<details use:DetailDropdown class="dropdown select-none dropdown--having-svg-in-summary">
    <summary class="cursor-pointer">{@html iconSchema}</summary>
    <div class="menu menu--vertical-padding widget-shadow" style="max-width:300px">

        {#if (helpTitle || helpDescription)}
            <div class="menu__help" style={'top: '+ helpOffsetTop +'px'}>
                <div class="menu__help-inner">
                    {#if helpTitle}<div class="menu__help-title">{ helpTitle }</div>{/if}
                    {#if helpDescription}<div class="menu__help-description">{ helpDescription }</div>{/if}
                </div>
            </div>
        {/if}

        {#each schemaDropdownItems as item (item)}
            <div class="menu__item"
                class:menu__item--dimmed="{item.alreadyAdded}"
                on:click="{()=>addRecord(item)}"
                on:mouseenter={(event) => onSchemaItemMouseEnter(event, item)}
                on:mouseleave={() => onSchemaItemMouseLeave() }
            >
                <span class="grow truncate">{item.recordIdentifier}</span>
            </div>
        {/each}
        <div class="menu__separator"></div>
        <div class="menu__item" on:click="{()=>dispatch('rename')}"><span class="grow truncate">Rename</span></div>
        {#if canReveal}
            <div class="menu__item" on:click="{()=>reveal()}"><span class="grow truncate">Reveal code</span></div>
        {/if}
        {#if canDelete}
            <div class="menu__item" on:click="{()=>dispatch('delete')}"><span class="grow truncate">Delete component</span></div>
        {/if}
    </div>
</details>
