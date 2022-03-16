<script>
    import { onMount } from 'svelte'
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    import { extension } from '../transport'

    import { form, field } from 'svelte-forms'
    import { required } from 'svelte-forms/validators'

    /** @type {import('../../../BreadboardTypes').Record} */
    export let record

    let rejectedMessage
    function handleUpdateRecord({ value }) {
        // TODO weird type coercion
        if (typeof value == 'string' && value.match(/^[1-9]{1}[0-9]*$/)) {
            value = parseInt(value)
        }
        if (typeof value == 'string' && value.match(/^[0-9]*\.[0-9]*$/)) {
            value = parseFloat(value)
        }
        extension.updateRecordValue({
            componentIdentifier: record.componentIdentifier,
            recordIdentifier: record.identifier,
            recordScope: record.scope,
            updateRecordValue: value,
        }).then(() => {
            rejectedMessage = null
            dispatch('success', {...record, value })
        }).catch(err => {
            rejectedMessage = (err instanceof Error) ? (err.message || err.toString()) : err.toString()
        })
    }

    $: showRejectedMessage = !! rejectedMessage
    function hideRejectedMessage() {
        showRejectedMessage = false
    }

    // BUG allow editing only Record[type=number|string]
    const _recordValue = field('recordValue', record.value, [
        required(),
    ])
    const _form = form(_recordValue)
    $: hideRejectedMessage($_form) // called each time when form is changed

    function captureEnterAndEscape(event) {
        if (event.keyCode == 13 /* Enter */) {
            if (! $_form.valid) { return }
            if ($_recordValue.value == record.value) { return dispatch('cancel') }
            handleUpdateRecord({
                value: $_recordValue.value,
            })
        }
        if (event.keyCode == 27 /* Esc */) { dispatch('cancel') }
    }

    let inputValueElement
    onMount(() => inputValueElement.focus())

</script>

    <input type="text" bind:this={inputValueElement}
        class="font-mono border-0 outline-editor"
        bind:value={$_recordValue.value}
        on:keyup={captureEnterAndEscape}
    >
    {#if (showRejectedMessage && rejectedMessage) || ! $_form.valid}
        <div style="background:red; color:white;">{(showRejectedMessage && rejectedMessage) ? rejectedMessage : $_form.errors[0]}</div>
    {/if}
