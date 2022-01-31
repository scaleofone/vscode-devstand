<script>
    import { onMount, createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    export let value = ''

    let textInput

    function captureEnterAndEscape(event) {
        if (event.keyCode == 13 /* Enter */) dispatch('success', { value })
        if (event.keyCode == 27 /* Esc */) dispatch('cancel')
    }

    onMount(() => textInput.focus())
</script>

<div>
    <input type="text"
        bind:this={textInput}
        bind:value={value}
        on:keydown={captureEnterAndEscape}
    >
</div>
