<script>
    import { components } from './stores/breadboard'
    import { squares } from './stores/visual'

    import Surface from './Surface.svelte'
    import Square from './Square.svelte'
    import Zoomer from './Zoomer.svelte'

    import Component from './Component.svelte'

</script>


<Surface>
    {#each $components as component (component.identifier)}
        <Square
            identifier={component.identifier}
            >
            <Component
                identifier={component.identifier}
            />
        </Square>
    {/each}
</Surface>

<div style="position: fixed; bottom: 0; right: 0; padding: 1rem;">
    <Zoomer />
</div>

<div style="position: fixed; top: 0; right: 0; padding: 1rem;">
    <details class="inline-block">
        <summary class="cursor-pointer hover:fg-link select-none">squares</summary>
        <pre style="background-color: white;">{JSON.stringify($squares, null, 2)}</pre>
    </details>
</div>
