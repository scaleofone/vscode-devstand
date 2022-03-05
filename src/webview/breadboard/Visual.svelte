<script>
    import { onMount } from 'svelte'
    import { extension, messengerReady } from './transport'

    import { components, records } from './stores/breadboard'
    import { squareDimensions, brickClamps, crawl, arrows } from './stores/arrows'
    import { pointer } from './stores/visual'

    import Surface from './Surface.svelte'
    import Square from './Square.svelte'
    import Brick from './Brick.svelte'
    import Zoomer from './Zoomer.svelte'

    import Component from './Component.svelte'
    import Record from './Record.svelte'

    onMount(() => setTimeout(() => messengerReady(true), 10))
</script>


<Surface>
    {#each $components as component (component)}
        <Square
            component={component}
            >
            <Component
                component={component}
                >

                {#each $records.filter(r => r.componentIdentifier == component.identifier && ! (r.type == 'object' && r.scope && r.scope.indexOf('.') == -1) ) as record (record) }
                    <Brick
                        record={record}
                        >

                        <Record
                            record={record}
                        />

                    </Brick>
                {/each}

            </Component>
        </Square>
    {/each}
</Surface>

<div style="position: fixed; bottom: 0; right: 0; padding: 0.5rem 1rem 1rem 0.5rem; background-color: var(--vscode-editor-background)">
    <div class="flex" style="gap: 5px; --button-size: 40px">
        <Zoomer />
        <button
            style="height: var(--button-size); padding-left: 1.5rem; padding-right: 1.5rem"
            on:click={() => extension.actionCreateComponent()}
        >Create component</button>
    </div>

</div>

<div style="position: fixed; top: 0; right: 0; padding: 1rem;">
    <details class="inline-block">
        <summary class="cursor-pointer hover:fg-link select-none">components</summary>
        <pre style="background-color: white;">{JSON.stringify($components, null, 2)}</pre>
    </details>
    <br>
    <details class="inline-block">
        <summary class="cursor-pointer hover:fg-link select-none">pointer</summary>
        <pre style="background-color: white;">{JSON.stringify($pointer, null, 2)}</pre>
    </details>
    <br>
    <details class="inline-block">
        <summary class="cursor-pointer hover:fg-link select-none">squareDimensions <b on:click|preventDefault={crawl}>UPD</b> </summary>
        <pre style="background-color: white;">{JSON.stringify($squareDimensions, null, 2)}</pre>
    </details>
    <br>
    <details class="inline-block">
        <summary class="cursor-pointer hover:fg-link select-none">brickClamps <b on:click|preventDefault={crawl}>UPD</b> </summary>
        <pre style="background-color: white;">{JSON.stringify($brickClamps, null, 2)}</pre>
    </details>
    <br>
    <details class="inline-block">
        <summary class="cursor-pointer hover:fg-link select-none">arrows <b on:click|preventDefault={crawl}>UPD</b> </summary>
        <pre style="background-color: white;">{JSON.stringify($arrows, null, 2)}</pre>
    </details>
</div>
