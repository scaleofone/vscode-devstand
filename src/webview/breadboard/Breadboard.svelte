<script>
    import Operations from './Operations.svelte'
    import Component from './Component.svelte'
    import CreateComponentButton from './controls/CreateComponentButton.svelte'

    import { components } from './stores/breadboard'

    import Menu from './controls/Menu.svelte'
</script>

{#each $components as component}
    <Component
        identifier={component.identifier}
    />
{/each}

<CreateComponentButton />

<Menu />

<br><br>
<details>
    <summary>Operations</summary>
    <Operations />
</details>
