<script>
    import { onMount } from 'svelte'
    import { messengerReady } from './transport'

    import { selectedBase } from './stores/base'

    import DistroBase from './DistroBase.svelte'
    import DistroModules from './DistroModules.svelte'
    import DistroServer from './DistroServer.svelte'
    import DistroFiles from './DistroFiles.svelte'
    import DistroSave from './DistroSave.svelte'

    onMount(() => setTimeout(() => messengerReady(true), 10))

</script>

<div>
    <br>

    <DistroBase />

    {#if $selectedBase}

        <DistroModules />

        <DistroServer />

        <DistroFiles />

        <DistroSave />

    {/if}

    <div style="height:20vh;"></div>
</div>
