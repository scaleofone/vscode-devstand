<script>
    import { components, records } from './stores/breadboard'
    import Record from './Record.svelte'

    export let identifier

    $: component = $components.find(c => c.identifier == identifier)
    $: componentRecords = $records.filter(r => r.componentIdentifier == identifier)

</script>

<div class="component" style="border:1px solid gray; padding:1rem">
    {component.identifier}
    <ul>
        {#each componentRecords as record}
            <Record
                identifier={record.identifier}
            />
        {/each}
    </ul>
</div>
