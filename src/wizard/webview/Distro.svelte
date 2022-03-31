<script>
    import { selectedBase } from './stores/distro'

    import DistroBaseSelector from './DistroBaseSelector.svelte'

</script>

<div>

    <DistroBaseSelector />

    <br><br>
    <pre>{ JSON.stringify({

    }, null, 2) }</pre>
</div>
