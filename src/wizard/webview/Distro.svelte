<script>
    import { selectedBase } from './stores/base'

    import DistroBase from './DistroBase.svelte'
    import DistroModules from './DistroModules.svelte'
    import DistroServer from './DistroServer.svelte'

</script>

<div>

    <DistroBase />

    {#if $selectedBase}

        <DistroModules />

        <DistroServer />

    {/if}

    <br><br>
    <pre>{ JSON.stringify({

    }, null, 2) }</pre>
</div>
