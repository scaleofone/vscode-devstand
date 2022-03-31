<script>
    import { selectedBase, selectedServer } from './stores/distro'

    import DistroBaseSelector from './DistroBaseSelector.svelte'
    import DistroModulesSelector from './DistroModulesSelector.svelte'
    import DistroServerSelector from './DistroServerSelector.svelte'
    import DistroServerConfig from './DistroServerConfig.svelte'

</script>

<div>

    <DistroBaseSelector />

    {#if $selectedBase}

        <DistroModulesSelector />

        <DistroServerSelector />

        {#if selectedServer}

            <DistroServerConfig />

        {/if}


    {/if}

    <br><br>
    <pre>{ JSON.stringify({

    }, null, 2) }</pre>
</div>
