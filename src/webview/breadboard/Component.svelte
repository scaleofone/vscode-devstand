<script>
    import { components, records } from './stores/breadboard'
    import { extension } from './transport'

    import Record from './Record.svelte'
    import ComponentDropdown from './ComponentDropdown.svelte'
    import ComponentSchemaDropdown from './ComponentSchemaDropdown.svelte'
    import RenameComponentForm from './controls/RenameComponentForm.svelte'

    export let identifier
    $: component = $components.find(c => c.identifier == identifier)
    $: componentRecords = $records.filter(r => r.componentIdentifier == identifier)

    let renameFormIsVisible = false
    function handleRenameComponent(updIdentifier) {
        console.log('handleRenameComponent')
        extension.renameComponent({
            before: identifier,
            after: updIdentifier,
        })
        renameFormIsVisible = false
    }
    function handleDeleteComponent() {
        console.log('handleDeleteComponent')
        extension.deleteComponent({
            identifier: identifier,
        })
    }
    function handleAddRecord(record) {
        extension.createRecordValue({
            componentIdentifier: record.componentIdentifier,
            recordIdentifier: record.identifier,
            recordValue: record.value,
            recordType: record.type,
        })
    }

</script>

<div class="component" id={identifier}>

    <div class="role-brick role-component-header">
        {#if renameFormIsVisible}

            <div class="flex items-center height-mono">
                <RenameComponentForm
                    component={component}
                    on:success={(event) => handleRenameComponent(event.detail.identifier)}
                    on:cancel={() => renameFormIsVisible = false}
                />
            </div>

        {:else}

            <div class="flex items-center height-mono">
                <div class="font-mono grow">
                    <b>{component.identifier}</b>: {component.templateImportVariableName}
                </div>
                <div class="shrink-0">
                    <ComponentDropdown
                        component={component}
                        on:delete={handleDeleteComponent}
                        on:rename={()=> renameFormIsVisible = true}
                    />
                </div>
                <div class="shrink-0">
                    <ComponentSchemaDropdown
                        component={component}
                        on:addRecord={(event) => handleAddRecord(event.detail)}
                    />
                </div>
            </div>

        {/if}
    </div>

    {#each componentRecords as record (identifier+record.identifier) }
        <Record
            componentIdentifier={identifier}
            identifier={record.identifier}
        />
    {/each}

</div>
