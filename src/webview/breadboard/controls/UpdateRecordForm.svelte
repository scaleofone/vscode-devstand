<script>
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    import { form, field } from 'svelte-forms'
    import { required } from 'svelte-forms/validators'

    export let record

    const _recordValue = field('recordValue', record.value, [
        required(),
    ])
    const _form = form(_recordValue)

    function captureEnterAndEscape(event) {
        if (event.keyCode == 13 /* Enter */) {
            if (! $_form.valid) { return }
            if ($_recordValue.value == record.value) { return dispatch('cancel') }
            dispatch('success', {
                value: $_recordValue.value,
            })
        }
        if (event.keyCode == 27 /* Esc */) { dispatch('cancel') }
    }
</script>

<div>
    <input type="text"
        bind:value={$_recordValue.value}
        on:keydown={captureEnterAndEscape}
    >
    {#if ! $_form.valid}
        <span style="color:red">{$_form.errors[0]}</span>
    {/if}
</div>
