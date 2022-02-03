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

<div class="role-brick role-record">

    <div class="flex items-center height-mono">
        <div class="grow">
            <span class="font-mono">
                {record.identifier}: {record.value} <small style="opacity:0.5">({record.type})</small>
            </span>
        </div>
        <div class="shrink-0">
            <RecordDropdown
                on:rename={handleRenameRecord}
                on:delete={handleDeleteRecord}
            />
        </div>
    </div>

</div>
