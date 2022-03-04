<script>
    import { extension } from './transport'
    import { colorHexForIndex } from './stores/visual'
    import { components } from './stores/breadboard'
    import { get } from 'svelte/store'

    import RecordDropdown from './RecordDropdown.svelte'
    import UpdateRecordForm from './controls/UpdateRecordForm.svelte'
    import ModifyRecordForm from './controls/ModifyRecordForm.svelte'

    /** @type {import('../../BreadboardTypes').Record} */
    export let record

    $: referencedComponent = record.referencedComponentIdentifier ? get(components).find(c => c.identifier == record.referencedComponentIdentifier) : undefined
    $: referencedComponentColorHex = referencedComponent ? colorHexForIndex(referencedComponent.colorIndex) : undefined

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

        <div class="flex items-center height-mono px-small"
            style={[
                `--referenced-component-color: ${referencedComponentColorHex || '#00F'}`
            ].join(';')}
            >

            <div class="grow">

                <span class="font-mono">

                    <span class:underline-dotted={! record.inSchema}>
                        {#if record.scope}<small>{record.scope}.</small>{/if}{record.identifier}
                    </span>

                    {#if ['number', 'string'].includes(record.type)}
                        {record.value}
                    {/if}

                    {#if ['reference', 'composition'].includes(record.type)}
                        <span style="color: var(--referenced-component-color); font-weight:bold">{record.referencedComponentIdentifier}.</span><span style="color: var(--referenced-component-color)">{record.referencedRecordIdentifier}</span>
                    {/if}

                    {#if record.type == 'concatenation'}
                        {#each record.concatenationItems as item (item)}
                            {#if Array.isArray(item)}
                                <span style="color: var(--referenced-component-color); font-weight:bold">{item[1]}</span>.<span style="color: var(--referenced-component-color)">{item[2]}</span>
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
