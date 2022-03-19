<script>
    import { getContext } from 'svelte'

    import { extension } from './transport'
    import { colorHexForIndex, dragoverResultSourceRecord, dragoverResultTargetRecordPath, focusedEditorRecordPath } from './stores/visual'
    import { components, recordPathsBeingEdited } from './stores/breadboard'
    import { removeRecordIfNotPersisted } from './stores/persist'
    import { get } from 'svelte/store'

    import RecordDropdown from './RecordDropdown.svelte'
    import ModifyRecordForm from './controls/ModifyRecordForm.svelte'

    /** @type {import('../../BreadboardTypes').Record} */
    export let record

    $: referencedComponent = record.referencedComponentIdentifier ? get(components).find(c => c.identifier == record.referencedComponentIdentifier) : undefined
    $: referencedComponentColorHex = referencedComponent ? colorHexForIndex(referencedComponent.colorIndex) : undefined

    $: modifyFormVisible = $recordPathsBeingEdited.includes(record.path)
    function setModifyFormVisible(isVisible) {
        recordPathsBeingEdited.update((paths) => (
            isVisible ? [...paths, record.path] : paths.filter(p => p != record.path)
        ))
    }

    function handleDeleteRecord() {
        console.log('handleDeleteRecord')
        extension.deleteRecord({
            componentIdentifier: record.componentIdentifier,
            recordIdentifier: record.identifier,
            recordScope: record.scope,
        })
    }

    let { setKnobVisible, setKnobIsForSection } = getContext('brick')
    $: setKnobVisible(! modifyFormVisible)
    $: setKnobIsForSection(record.type == 'object' || record.type == 'composition' || (record.type == 'reference' && record.referencedRecordIdentifier == 'env'))

    let modifyFormComponent

    function autofocusOnModifyForm() {
        focusedEditorRecordPath.set(record.path)
    }

    $: if ($dragoverResultTargetRecordPath == record.path) {
        let referenceString = '{' + $dragoverResultSourceRecord.path + '}'
        if (modifyFormVisible) {
            modifyFormComponent.setValue(record.value.toString() + referenceString)
            modifyFormComponent.focusOnInputValueElement(record.value.toString().length)
        } else {
            console.log('Create NEW Record[type=reference][value="' + referenceString + '"] below Record[path="' + record.path + '"]')
        }
        dragoverResultTargetRecordPath.set('')
        dragoverResultSourceRecord.set(null)
    }

</script>



    {#if modifyFormVisible}

        <div class="flex items-center height-mono">
            <ModifyRecordForm
                bind:this={modifyFormComponent}
                record={record}
                on:success={(event) => console.log('modified Record', event.detail) }
                on:success={() => setModifyFormVisible(false)}
                on:cancel={() => { setModifyFormVisible(false); removeRecordIfNotPersisted(record); }}
            />
        </div>

    {:else}

        <div class="flex items-center height-mono px-small show-record-dropdown-button-on-hover"
            style={[
                `--referenced-component-color: ${referencedComponentColorHex || '#00F'}`
            ].join(';')}
            >

            {#if record.type == 'object' || record.type == 'composition' || (record.type == 'reference' && record.referencedRecordIdentifier == 'env')}

                <div class="grow truncate" style="max-width: 300px;">
                    <span class="font-mono flex">
                        <span>{record.identifier}</span>
                        {#if ['composition', 'reference'].includes(record.type)}
                            <span class="px-small">+</span>
                            <span style="color: var(--referenced-component-color); font-weight:bold">{record.referencedComponentIdentifier}.</span>
                            <span style="color: var(--referenced-component-color)">{record.referencedRecordIdentifier}</span>
                        {/if}
                    </span>
                </div>

            {:else}

            <div class="grow truncate" style="max-width: 300px;">

                <span class="font-mono flex"
                    on:dblclick={()=> { autofocusOnModifyForm(); setModifyFormVisible(true); }}
                    >

                    <span class:underline-dotted={! record.inSchema}
                        >{#if record.shortScope}{record.shortScope}.{/if}{record.identifier}</span>

                    <span class="pr-small">:</span>

                    {#if ['number', 'string'].includes(record.type)}
                        <span>{record.value}</span>
                    {/if}

                    {#if record.type == 'reference'}
                        <span style="color: var(--referenced-component-color); font-weight:bold">{record.referencedComponentIdentifier}.</span>
                        <span style="color: var(--referenced-component-color)">{record.referencedRecordIdentifier}</span>
                    {/if}

                    {#if record.type == 'concatenation'}
                        {#each record.concatenationItems as item, i (i + (Array.isArray(item) ? item.join() : item.toString()))}
                            {#if Array.isArray(item)}
                                <span style="color: var(--referenced-component-color); font-weight:bold">{item[1]}</span>
                                <span style="color: var(--referenced-component-color)">.{item[2]}</span>
                            {:else}
                                <span>{item}</span>
                            {/if}
                        {/each}
                    {/if}

                </span>

            </div>

            {/if}

            <div class="shrink-0 record-dropdown-button">
                <RecordDropdown
                    record={record}
                    on:modify={()=> { autofocusOnModifyForm(); setModifyFormVisible(true); }}
                    on:delete={handleDeleteRecord}
                />
            </div>

        </div>

    {/if}
