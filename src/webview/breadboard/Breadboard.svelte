<script>
    import Operations from './Operations.svelte'
    import StorePreview from './StorePreview.svelte'
    import Component from './Component.svelte'
    import Record from './Record.svelte'
    import CreateComponentButton from './controls/CreateComponentButton.svelte'

    import { components, records } from './stores/breadboard'
</script>

<section>

{#each $components as component (component)}
    <Component
        component={component}
        >

        {#each $records.filter(r => r.componentIdentifier == component.identifier ) as record (record) }
            <Record
                record={record}
            />
        {/each}

    </Component>
{/each}

</section>

<CreateComponentButton />

<StorePreview />
<Operations />
