<script>
    import { components, records, templateImports, schemaDictionary } from './stores/breadboard'
    import { get } from 'svelte/store'
    import { extension } from './transport'

    import Record from './Record.svelte'

    import DetailDropdown from './controls/DetailDropdown'
    import iconDropdown from '@vscode/codicons/src/icons/tools.svg'
    import iconSchema from '@vscode/codicons/src/icons/code.svg'

    import RenameComponentForm from './controls/RenameComponentForm.svelte'

    export let identifier
    $: component = $components.find(c => c.identifier == identifier)
    $: componentRecords = $records.filter(r => r.componentIdentifier == identifier)
    $: componentRecordsIdentifiers = componentRecords.map(r => r.identifier)
    $: templateImport = component ? get(templateImports).find(ti => ti.variableName == component.templateImportVariableName) : undefined
    $: schema = templateImport ? get(schemaDictionary).find(dictItem => templateImport.targetFile == dictItem.targetFile && templateImport.targetIdentifier == dictItem.targetIdentifier).schema : undefined
    $: availableRecordIdentifiers = schema ? Object.keys(schema.properties) : []
    $: schemaDropdownOptions = availableRecordIdentifiers.map(i => (componentRecordsIdentifiers.includes(i) ? '-' : '+')+' '+i)

    let renameFormIsVisible = false
    function handleRenameComponent(renameComponentIdentifier) {
        console.log('handleRenameComponent')
        extension.renameComponent({
            before: identifier,
            after: renameComponentIdentifier,
        })
        renameFormIsVisible = false
    }
    function handleDeleteComponent() {
        console.log('handleDeleteComponent')
        extension.deleteComponent({
            identifier: identifier,
        })
    }

</script>

<div class="component" style="border:1px solid gray; padding:1rem">
    <span class="code-font">
        {component.identifier}: {component.templateImportVariableName}
    </span>

    <details use:DetailDropdown class="dropdown inline-block">
        <summary class="fg-icon hover:fg-link cursor-pointer">{@html iconDropdown}</summary>
        <div class="menu menu--vertical-padding widget-shadow" style="max-width:300px">
            <div class="menu__item"
                on:click="{() => renameFormIsVisible = true}"
            ><span class="grow truncate">Rename component</span></div>
            <div class="menu__item"
                on:click="{handleDeleteComponent}"
            ><span class="grow truncate">Delete component</span></div>
        </div>
    </details>

    <details use:DetailDropdown class="dropdown inline-block">
        <summary class="fg-icon hover:fg-link cursor-pointer">{@html iconSchema}</summary>
        <div class="menu menu--mono widget-shadow">
            {#each schemaDropdownOptions as caption}
                <div class="menu__item"><span class="grow truncate">{caption}</span></div>
            {/each}
        </div>
    </details>

        {#if renameFormIsVisible}
            <RenameComponentForm
                value={identifier}
                on:success={(event) => handleRenameComponent(event.detail.value)}
                on:cancel={() => renameFormIsVisible = false}
            />
        {/if}

        <div style="height:0.3rem"></div>

        {#each componentRecords as record}
            <Record
                componentIdentifier={identifier}
                identifier={record.identifier}
            />
        {/each}

</div>
