<script>
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    import { records } from '../stores/breadboard'
    import { get } from 'svelte/store'

    import { form, field } from 'svelte-forms'
    import { required } from 'svelte-forms/validators'

    export let componentIdentifier
    export let record
    export let rejectedMessage

    $: showRejectedMessage = !! rejectedMessage
    function hideRejectedMessage() {
        showRejectedMessage = false
    }

    const _recordIdentifier = field('recordIdentifier', record.identifier, [
        required(),
        (val) => ({
            name: 'unique',
            valid: (val == record.identifier || get(records).findIndex(r => r.identifier == val && r.componentIdentifier == componentIdentifier) == -1)
        }),
    ])
    const _recordValue = field('recordValue', record.value, [
        required(),
    ])
    const _form = form(_recordIdentifier, _recordValue)

    function captureEnterAndEscape(event) {
        if (event.keyCode == 13 /* Enter */) {
            if (! $_form.valid) { return }
            if ($_recordIdentifier.value == record.identifier && $_recordValue.value == record.value) { return dispatch('cancel') }
            dispatch('success', {
                identifier: $_recordIdentifier.value,
                value: $_recordValue.value,
            })
        }
        if (event.keyCode == 27 /* Esc */) { dispatch('cancel') }
    }
</script>

<div
    on:keyup={() => hideRejectedMessage()}
    >
    <input type="text"
        placeholder="identifier"
        bind:value={$_recordIdentifier.value}
        on:keyup={captureEnterAndEscape}
    >
    <input type="text"
        placeholder="value"
        bind:value={$_recordValue.value}
        on:keyup={captureEnterAndEscape}
    >
    {#if ! $_form.valid}
        <span style="color:red">{$_form.errors[0]}</span>
    {/if}
    {#if showRejectedMessage}
        <span style="color:darkred">{rejectedMessage}</span>
    {/if}
</div>
