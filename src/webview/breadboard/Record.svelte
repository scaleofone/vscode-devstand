<script>
    import { extension } from './transport'

    import RecordDropdown from './RecordDropdown.svelte'
    import UpdateRecordForm from './controls/UpdateRecordForm.svelte'
    import ModifyRecordForm from './controls/ModifyRecordForm.svelte'

    export let record

    let modifyFormVisible = false
    let updateFormVisible = false

    function handleDeleteRecord() {
        console.log('handleDeleteRecord')
        extension.deleteRecord({
            componentIdentifier: record.componentIdentifier,
            recordIdentifier: record.identifier,
        })
    }

</script>

<div class="role-brick role-record">

    {#if updateFormVisible}

        <div class="flex items-center height-mono">
            <UpdateRecordForm
                record={record}
                on:success={(event) => console.log('modified Record', event.detail) }
                on:success={() => updateFormVisible = false}
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
                    {#if record.scope}<small style="opacity:0.5">{record.scope}.</small>{/if}{record.identifier}
                    {#if ['number', 'string'].includes(record.type)} = {record.value}{/if}
                    {#if ['reference', 'composition'].includes(record.type)} = <span style="color:blue; font-weight:bold">{record.referencedComponentIdentifier}</span>.<span style="color:blue">{record.referencedRecordIdentifier}</span>{/if}
                    {#if record.type == 'concatenation'} =
                        {#each record.concatenationItems as item (item)}
                            {#if Array.isArray(item)}
                                <span style="color:blue; font-weight:bold">{item[1]}</span>.<span style="color:blue">{item[2]}</span>
                            {:else}
                                {item}
                            {/if}
                        {/each}
                    {/if}
                    <small style="opacity:0.5">[{record.type}]</small>
                </span>

            </div>
            <div class="shrink-0">
                <RecordDropdown
                    record={record}
                    on:modify={()=> { updateFormVisible = false; modifyFormVisible = true; }}
                    on:update={()=> { modifyFormVisible = false; updateFormVisible = true; }}
                    on:delete={handleDeleteRecord}
                />
            </div>
        </div>

    {/if}



</div>
