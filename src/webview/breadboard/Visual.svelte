<script>
    import { onMount } from 'svelte'
    import { webviewIsReady } from './transport'

    import { components } from './stores/breadboard'

    import Surface from './Surface.svelte'
    import Square from './Square.svelte'
    import Zoomer from './Zoomer.svelte'

    import Component from './Component.svelte'

    onMount(webviewIsReady)
</script>


<Surface>
    {#each $components as component (component)}
        <Square
            component={component}
            >
            <Component
                component={component}
            />
        </Square>
    {/each}
</Surface>

<div style="position: fixed; bottom: 0; right: 0; padding: 1rem;">
    <Zoomer />
</div>

<div style="position: fixed; top: 0; right: 0; padding: 1rem;">
    <details class="inline-block">
        <summary class="cursor-pointer hover:fg-link select-none">components</summary>
        <pre style="background-color: white;">{JSON.stringify($components, null, 2)}</pre>
    </details>
</div>
