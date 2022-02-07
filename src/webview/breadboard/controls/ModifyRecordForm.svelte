<script>
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    import { records } from '../stores/breadboard'

    import { form, field } from 'svelte-forms'
    import { required } from 'svelte-forms/validators'

    export let componentIdentifier
    export let recordIdentifier
    export let recordValue

    const _recordIdentifier = field('recordIdentifier', recordIdentifier, [
        required(),
        (val) => ({
            name: 'unique',
            valid: (val == recordIdentifier || $records.findIndex(r => r.identifier == val && r.componentIdentifier == componentIdentifier) == -1)
        }),
    ])
    const _recordValue = field('recordValue', recordValue, [
        required(),
    ])
    const _form = form(_recordIdentifier, _recordValue)

    function captureEnterAndEscape(event) {
        if (event.keyCode == 13 /* Enter */) {
            if (! $_form.valid) { return }
            if ($_recordIdentifier.value == recordIdentifier && $_recordValue.value == recordValue) { return dispatch('cancel') }
            dispatch('success', {
                recordIdentifier: $_recordIdentifier.value,
                recordValue: $_recordValue.value,
            })
        }
        if (event.keyCode == 27 /* Esc */) { dispatch('cancel') }
    }
</script>

<div>
    <input type="text"
        placeholder="identifier"
        bind:value={$_recordIdentifier.value}
        on:keydown={captureEnterAndEscape}
    >
    <input type="text"
        placeholder="value"
        bind:value={$_recordValue.value}
        on:keydown={captureEnterAndEscape}
    >
    {#if ! $_form.valid}
        <span style="color:red">{$_form.errors[0]}</span>
    {/if}
</div>
