<script>
    import { records } from './stores/breadboard'

    export let identifier

    $: record = $records.find(r => r.identifier == identifier)

</script>

<li>{record.identifier}: {record.value}</li>
