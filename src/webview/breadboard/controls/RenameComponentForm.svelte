<script>
    import { onMount, createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    import { components } from '../stores/breadboard'
    import { get } from 'svelte/store'

    import { form, field } from 'svelte-forms'
    import { required } from 'svelte-forms/validators'

    /** @type {import('../../../BreadboardTypes').Component} */
    export let component

    let textInput

    const _componentIdentifier = field('componentIdentifier', component.identifier, [
        required(),
        (val) => ({
            name: 'unique',
            valid: (val == component.identifier || get(components).findIndex(c => c.identifier == val) == -1)
        }),
    ])
    const _form = form(_componentIdentifier)

    function captureEnterAndEscape(event) {
        if (event.keyCode == 13 /* Enter */) {
            if (! $_form.valid) { return }
            if ($_componentIdentifier.value == component.identifier) { return dispatch('cancel') }
            dispatch('success', {
                identifier: $_componentIdentifier.value,
            })
        }
        if (event.keyCode == 27 /* Esc */) { dispatch('cancel') }
    }

    onMount(() => textInput.focus())
</script>

<div>
    <input type="text"
        class="font-mono px-small"
        bind:this={textInput}
        bind:value={$_componentIdentifier.value}
        on:keydown={captureEnterAndEscape}
    >
    {#if ! $_form.valid}
        <span style="color:red">{$_form.errors[0]}</span>
    {/if}
</div>
