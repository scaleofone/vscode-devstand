<script>
    import Operations from './Operations.svelte'
    import StorePreview from './StorePreview.svelte'
    import Component from './Component.svelte'
    import CreateComponentButton from './controls/CreateComponentButton.svelte'

    import { components } from './stores/breadboard'
</script>

<section>

{#each $components as component (component)}
    <Component
        component={component}
    />
{/each}

</section>

<CreateComponentButton />

<StorePreview />
<Operations />
