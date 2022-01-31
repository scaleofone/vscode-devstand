<script>
    import { components, records } from './stores/breadboard'
    import { extension } from './transport'

    import Record from './Record.svelte'
    import Dropdown from './controls/Dropdown.svelte'

    export let identifier

    $: component = $components.find(c => c.identifier == identifier)
    $: componentRecords = $records.filter(r => r.componentIdentifier == identifier)

    function handleRenameComponent() {
        console.log('handleRenameComponent')
        extension.renameComponent({
            before: identifier,
            after: identifier+'_renamed',
        })
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
                handler: handleRenameComponent,
            }, {
                caption: 'Delete component',
                handler: handleDeleteComponent,
            }
        ]}
    >edit</Dropdown>


        {#each componentRecords as record}
            <Record
                componentIdentifier={identifier}
                identifier={record.identifier}
            />
        {/each}

</div>
