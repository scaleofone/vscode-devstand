<script>
    import { records } from './stores/breadboard'
    import { extension } from './transport'

    import Dropdown from './controls/Dropdown.svelte'

    export let componentIdentifier
    export let identifier

    $: record = $records.find(r => r.identifier == identifier)

    function handleDeleteRecord() {
        console.log('handleDeleteRecord')
        extension.deleteRecord({
            componentIdentifier: componentIdentifier,
            recordIdentifier: identifier,
        })
    }

</script>

<div>
    {record.identifier}: {record.value}
    <Dropdown
        options={[
            {
                caption: 'Delete record',
                handler: handleDeleteRecord,
            }
        ]}
    >edit</Dropdown>
</div>
