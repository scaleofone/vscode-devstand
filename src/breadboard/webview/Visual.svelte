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
    // onMount(() => document.documentElement.classList.add('hide-scrollbars', 'hide-arrows', 'hide-dots', 'smaller-bottom-action-area', 'hide-deploy-button', 'teal-buttons', 'hide-square-shadows', 'make-bg-green', 'hide-component-dropdown'))
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

<div class="bottom-action-area">
    <div class="flex" style="gap: 5px">
        <!--
        <Zoomer />
        -->
        <button
            class="bottom-action-button nowrap"
            on:click={() => { extension.actionCreateComponent(guessGeometryForNewComponent()) }}
        >Add component</button>
        <button
            class="bottom-action-button nowrap"
            on:click={() => { extension.actionDeployButton() }}
        >Deploy</button>
    </div>

</div>

<!--
<StorePreview />
-->
