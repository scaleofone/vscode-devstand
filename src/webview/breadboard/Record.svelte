<script>
    import { records } from './stores/breadboard'
    import { extension } from './transport'

    import Dropdown from './controls/Dropdown.svelte'

    export let componentIdentifier
    export let identifier

    $: record = $records.find(r => (r.identifier == identifier && r.componentIdentifier == componentIdentifier))

    function handleDeleteRecord() {
        console.log('handleDeleteRecord')
        extension.deleteRecord({
            componentIdentifier: componentIdentifier,
            recordIdentifier: identifier,
        })
    }
    function handleRenameRecord() {
        console.log('handleRenameRecord')
        extension.renameRecord({
            componentIdentifier: componentIdentifier,
            recordIdentifier: identifier,
            renameRecordIdentifier: identifier+'_renamed',
        })
    }

</script>

<div style="padding: 0.3rem 0 0.3rem 1rem">
    {record.identifier}: {record.value} ({record.type})
    <Dropdown
        options={[
            {
                caption: 'Rename record',
                handler: handleRenameRecord,
            }, {
                caption: 'Delete record',
                handler: handleDeleteRecord,
            }
        ]}
    >edit</Dropdown>
</div>
