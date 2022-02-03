<script>
    import { records } from './stores/breadboard'
    import { get } from 'svelte/store'
    import { extension } from './transport'

    import RecordDropdown from './RecordDropdown.svelte'

    export let componentIdentifier
    export let identifier

    $: record = get(records).find(r => (r.identifier == identifier && r.componentIdentifier == componentIdentifier))

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

<div style="padding: 0 0 0 1rem">
    <span class="code-font">
        {record.identifier}: {record.value} ({record.type})
    </span>
    <RecordDropdown
        on:rename={handleRenameRecord}
        on:delete={handleDeleteRecord}
    />
</div>
