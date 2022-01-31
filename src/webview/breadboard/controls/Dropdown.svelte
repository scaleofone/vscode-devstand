<script>
    import { onDestroy } from 'svelte'

    export let options = []

    let detailsElement
    const handleClickOutside = event => { if (! detailsElement.contains(event.target)) detailsElement.open = false }
    const toggleEventListener = event => document[ event.target.open ? 'addEventListener' : 'removeEventListener' ]('click', handleClickOutside, true)
    onDestroy(() => document.removeEventListener('click', handleClickOutside, true))
</script>

<details class="dropdown"
    bind:this={detailsElement}
    on:toggle={toggleEventListener}
    >
    <summary>
        <slot></slot>
    </summary>
    {#if options.length > 0}
        <ul>
            {#each options as option}
                <li
                    on:click={option.handler}
                    on:click={detailsElement.open = false}
                >{option.caption}</li>
            {/each}
        </ul>
    {/if}
</details>
