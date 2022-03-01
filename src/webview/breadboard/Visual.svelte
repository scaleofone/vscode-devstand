<script>
    import { components } from './stores/breadboard'

    import Surface from './Surface.svelte'
    import Square from './Square.svelte'
    import Zoomer from './Zoomer.svelte'

    import Component from './Component.svelte'

</script>


<Surface>
    {#each $components as component}
        <Square>
            <Component
                identifier={component.identifier}
            />
        </Square>
    {/each}
</Surface>

<div style="position: fixed; bottom: 0; right: 0; padding: 1rem;">
    <Zoomer />
</div>
