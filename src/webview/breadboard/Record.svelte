<script>
    import { records } from './stores/breadboard'
    import { get } from 'svelte/store'
    import { extension } from './transport'

    import RecordDropdown from './RecordDropdown.svelte'
    import UpdateRecordForm from './controls/UpdateRecordForm.svelte'
    import ModifyRecordForm from './controls/ModifyRecordForm.svelte'

    export let componentIdentifier
    export let identifier

    $: record = get(records).find(r => (r.identifier == identifier && r.componentIdentifier == componentIdentifier))

    let modifyFormVisible = false
    let updateFormVisible = false

    function handleDeleteRecord() {
        console.log('handleDeleteRecord')
        extension.deleteRecord({
            componentIdentifier: componentIdentifier,
            recordIdentifier: identifier,
        })
    }
    function handleUpdateRecord(updValue) {
        console.log('handleUpdateRecord')
        extension.updateRecordValue({
            componentIdentifier,
            recordIdentifier: record.identifier,
            updateRecordValue: updValue,
        })
        updateFormVisible = false
    }

</script>

<div class="role-brick role-record">

    {#if updateFormVisible}

        <div class="flex items-center height-mono">
            <UpdateRecordForm
                record={record}
                on:success={(event) => handleUpdateRecord(event.detail.value)}
                on:cancel={() => updateFormVisible = false}
            />
        </div>

    {:else if modifyFormVisible}

        <div class="flex items-center height-mono">
            <ModifyRecordForm
                record={record}
                on:success={(event) => console.log('modified Record', event.detail) }
                on:success={() => modifyFormVisible = false}
                on:cancel={() => modifyFormVisible = false}
            />
        </div>

    {:else}

        <div class="flex items-center height-mono">
            <div class="grow">
                <span class="font-mono">
                    {record.identifier}: {record.value} <small style="opacity:0.5">({record.type})</small>
                </span>
            </div>
            <div class="shrink-0">
                <RecordDropdown
                    on:modify={()=> { updateFormVisible = false; modifyFormVisible = true; }}
                    on:update={()=> { modifyFormVisible = false; updateFormVisible = true; }}
                    on:delete={handleDeleteRecord}
                />
            </div>
        </div>

    {/if}



</div>
