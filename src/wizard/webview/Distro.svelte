<script>
    import { selectedBase } from './stores/distro'

    import DistroBaseSelector from './DistroBaseSelector.svelte'
    import DistroModulesSelector from './DistroModulesSelector.svelte'
    import DistroServerSelector from './DistroServerSelector.svelte'

</script>

<div>

    <DistroBaseSelector />

    {#if $selectedBase}

        <DistroModulesSelector />

        <DistroServerSelector />

    {/if}

    <br><br>
    <pre>{ JSON.stringify({

    }, null, 2) }</pre>
</div>
