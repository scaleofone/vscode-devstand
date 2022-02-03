<script>
    import { records } from './stores/breadboard'
    import { get } from 'svelte/store'
    import { extension } from './transport'

    import DetailDropdown from './controls/DetailDropdown'

    export let componentIdentifier
    export let identifier

    $: record = get(records).find(r => (r.identifier == identifier && r.componentIdentifier == componentIdentifier))

    function handleDeleteRecord() {
        console.log('handleDeleteRecord')
        extension.deleteRecord({
            componentIdentifier: componentIdentifier,
            recordIdentifier: identifier,
        })
    }
    function handleRenameRecord() {
        console.log('handleRenameRecord')
        extension.renameRecord({
            componentIdentifier: componentIdentifier,
            recordIdentifier: identifier,
            renameRecordIdentifier: identifier+'_renamed',
        })
    }

</script>

<div style="padding: 0 0 0 1rem">
    <span class="code-font">
        {record.identifier}: {record.value} ({record.type})
    </span>
    <details use:DetailDropdown class="dropdown inline-block">
        <summary class="fg-icon hover:fg-link cursor-pointer">edit</summary>
        <div class="menu menu--vertical-padding widget-shadow">
            <div class="menu__item" on:click="{handleRenameRecord}"><span class="grow truncate">Rename record</span></div>
            <div class="menu__item" on:click="{handleDeleteRecord}"><span class="grow truncate">Delete record</span></div>
        </div>
    </details>
</div>
