<script>
    import { components, records } from './stores/breadboard'
    import { extension } from './transport'

    import Record from './Record.svelte'
    import Dropdown from './controls/Dropdown.svelte'
    import RenameComponentForm from './controls/RenameComponentForm.svelte'

    export let identifier

    $: component = $components.find(c => c.identifier == identifier)
    $: componentRecords = $records.filter(r => r.componentIdentifier == identifier)

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
    {component.identifier}: {component.templateImportVariableName}
    <Dropdown
        options={[
            {
                caption: 'Rename component',
                handler: () => renameFormIsVisible = true,
            }, {
                caption: 'Delete component',
                handler: handleDeleteComponent,
            }
        ]}
    >edit</Dropdown>

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
