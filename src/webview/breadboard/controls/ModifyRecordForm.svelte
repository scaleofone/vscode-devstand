<script>
    import { onMount, tick } from 'svelte'
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    import { extension } from '../transport'
    import { records } from '../stores/breadboard'
    import { get } from 'svelte/store'

    import { form, field } from 'svelte-forms'
    import { required } from 'svelte-forms/validators'

    /** @type {import('../../../BreadboardTypes').Record} */
    export let record

    // TODO: true if the schema has patternProperties
    $: canModifyIdentifier = record.scope.startsWith('env')

    let rejectedMessage
    function handleModifyRecord({ identifier, value }) {
        // TODO weird type coercion
        if (typeof value == 'string' && value.match(/^[1-9]{1}[0-9]*$/)) {
            value = parseInt(value)
        }
        if (typeof value == 'string' && value.match(/^[0-9]*\.[0-9]*$/)) {
            value = parseFloat(value)
        }
        extension.modifyRecord({
            componentIdentifier: record.componentIdentifier,
            recordIdentifier: record.identifier,
            recordScope: record.scope,
            renameRecordIdentifier: identifier,
            updateRecordValue: value,
        }).then(() => {
            rejectedMessage = null
            dispatch('success', {...record, identifier, value })
        }).catch(err => {
            rejectedMessage = (err instanceof Error) ? (err.message || err.toString()) : err.toString()
        })
    }

    $: showRejectedMessage = !! rejectedMessage
    function hideRejectedMessage() {
        showRejectedMessage = false
    }

    const _recordIdentifier = field('recordIdentifier', record.identifier, [
        required(),
        (val) => ({
            name: 'unique',
            valid: (val == record.identifier || get(records).findIndex(r => r.identifier == val && r.componentIdentifier == record.componentIdentifier) == -1)
        }),
    ])
    // BUG allow editing only Record[type=number|string]
    const _recordValue = field('recordValue', record.value, [
        required(),
    ])
    const _form = form(_recordIdentifier, _recordValue)
    $: hideRejectedMessage($_form) // called each time when form is changed

    function captureEnterAndEscape(event) {
        if (event.keyCode == 13 /* Enter */) {
            if (! $_form.valid) { return }
            if ($_recordIdentifier.value == record.identifier && $_recordValue.value == record.value) { return dispatch('cancel') }
            handleModifyRecord({
                identifier: $_recordIdentifier.value,
                value: $_recordValue.value,
            })
        }
        if (event.keyCode == 27 /* Esc */) { dispatch('cancel') }
    }

    /** @type HTMLInputElement */ let inputIdentifierElement
    /** @type HTMLInputElement */ let inputValueElement
    /** @type HTMLSpanElement */  let contentIdentifierElement

    function matchIdentifierWidth() {
        console.log(contentIdentifierElement.offsetWidth)
        inputIdentifierElement.style.width = `${ contentIdentifierElement.offsetWidth + 1 }px`
    }
    _recordIdentifier.subscribe(async () => {
        await tick()
        matchIdentifierWidth()
    })

    onMount(() => { inputValueElement.focus(); inputValueElement.setSelectionRange(0, inputValueElement.value.length); })
</script>


<div class="relative" style="width: 100%;">

    <div class="flex">
    <input type="text"
        bind:this={inputIdentifierElement}
        disabled={! canModifyIdentifier}
        placeholder="identifier"
        class="font-mono border-0 px-small shrink"
        class:outline-none={! canModifyIdentifier}
        class:outline-editor={canModifyIdentifier}
        class:outline-invalid={canModifyIdentifier && ((showRejectedMessage && rejectedMessage) || ! $_form.valid)}
        bind:value={$_recordIdentifier.value}
        on:keyup={captureEnterAndEscape}
    >
    <input type="text"
        bind:this={inputValueElement}
        placeholder="value"
        class="font-mono border-0 outline-editor px-small grow element--inputValue"
        class:outline-invalid={(showRejectedMessage && rejectedMessage) || ! $_form.valid}
        bind:value={$_recordValue.value}
        on:keyup={captureEnterAndEscape}
    >
    </div>

    {#if (showRejectedMessage && rejectedMessage) || ! $_form.valid}
        <div
            class="absolute border-invalid bg-invalid px-small py-for-small" style="z-index: 3; top: calc(var(--height-mono) - 1px); left: -1px;"
            >{(showRejectedMessage && rejectedMessage) ? rejectedMessage : $_form.errors[0]}</div>
    {/if}


    <div class="absolute" style="opacity: 0; z-index: -1">
        <div class="font-mono px-small min-max-width--contentIdentifierElement" style="float: left;"
            bind:this={contentIdentifierElement}
        >{$_recordIdentifier.value}</div>
    </div>

</div>
