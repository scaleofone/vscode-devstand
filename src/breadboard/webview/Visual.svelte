<script>
    import { onMount } from 'svelte'
    import { extension, messengerReady } from './transport'

    import { components, records } from './stores/breadboard'
    import { guessGeometryForNewComponent } from './stores/arrows'

    import Surface from './Surface.svelte'
    import Square from './Square.svelte'
    import Brick from './Brick.svelte'
    import Zoomer from './Zoomer.svelte'

    import Component from './Component.svelte'
    import Record from './Record.svelte'

    import StorePreview from './StorePreview.svelte'

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

<div style="position: fixed; --scrollbar-width: 10px; bottom: var(--scrollbar-width); right: var(--scrollbar-width); padding: var(--scrollbar-width); background-color: var(--vscode-editor-background)">
    <div class="flex" style="gap: 5px; --button-size: 40px">
        <!--
        <Zoomer />
        -->
        <button
            style="height: var(--button-size); padding-left: 1.5rem; padding-right: 1.5rem; white-space: nowrap;"
            on:click={() => { extension.actionCreateComponent(guessGeometryForNewComponent()) }}
        >Add component</button>
        <button
            style="height: var(--button-size); padding-left: 1.5rem; padding-right: 1.5rem"
            on:click={() => { extension.actionDeployButton() }}
        >Deploy</button>
    </div>

</div>

<!--
<StorePreview />
-->
