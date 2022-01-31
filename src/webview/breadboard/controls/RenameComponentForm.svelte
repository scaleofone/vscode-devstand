<script>
    import { onMount, createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    import { components } from '../stores/breadboard'

    import { form, field } from 'svelte-forms'
    import { required } from 'svelte-forms/validators'

    export let value = ''

    let textInput

    const componentIdentifier = field('componentIdentifier', value, [
        required(),
        (val) => ({
            name: 'unique',
            valid: (value == val || $components.findIndex(component => component.identifier == val) == -1)
        }),
    ])
    const formInstance = form(componentIdentifier)

    function captureEnterAndEscape(event) {
        if (event.keyCode == 13 /* Enter */) {
            if (! $formInstance.valid) { return }
            if ($componentIdentifier.value != value) {
                dispatch('success', { value: $componentIdentifier.value })
            } else {
                dispatch('cancel')
            }
        }
        if (event.keyCode == 27 /* Esc */) { dispatch('cancel') }
    }

    onMount(() => textInput.focus())
</script>

<div>
    <input type="text"
        bind:this={textInput}
        bind:value={$componentIdentifier.value}
        on:keydown={captureEnterAndEscape}
    >
    {#if ! $formInstance.valid}
        <span style="color:red">{$formInstance.errors[0]}</span>
    {/if}
</div>
