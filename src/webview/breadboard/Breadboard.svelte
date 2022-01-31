<script>
    import Operations from './Operations.svelte'
    import Component from './Component.svelte'
    import CreateComponentButton from './CreateComponentButton.svelte'

    import { components } from './stores/breadboard'

</script>

{#each $components as component}
    <Component
        identifier={component.identifier}
    />
{/each}

<CreateComponentButton />

<br><br>
<details>
    <summary>Operations</summary>
    <Operations />
</details>
