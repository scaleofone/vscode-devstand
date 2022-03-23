<script>
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    import iconDropdown from '@vscode/codicons/src/icons/ellipsis.svg'
    import DetailDropdown from './controls/DetailDropdown'

    import { extension } from './transport'

    /** @type {import('../../BreadboardTypes').Record} */
    export let record

    $: canReveal = 'vscodeRange' in record
    function reveal() {
        extension.openDocument({
            preserveFocus: false,
            preview: false,
            selection: record.vscodeRange,
            viewColumn: 'Beside',
        })
    }

    $: kindaObject = (record.type == 'object' || record.type == 'composition' || (record.type == 'reference' && record.referencedRecordIdentifier == 'env'))
    $: canAddRecordInsideScope = kindaObject
    $: canModify = ! kindaObject

    let canDelete = true

</script>

<details use:DetailDropdown class="dropdown select-none dropdown--having-svg-in-summary">
    <summary class="cursor-pointer svg-rotate-90">{@html iconDropdown}</summary>
    <div class="menu menu--vertical-padding widget-shadow">
        {#if canAddRecordInsideScope}
            <div class="menu__item" on:click="{()=>dispatch('addInsideScope')}"><span class="grow truncate">Add env variable</span></div>
        {/if}
        {#if canModify}
            <div class="menu__item" on:click="{()=>dispatch('modify')}"><span class="grow truncate">Update</span></div>
        {/if}
        {#if canReveal}
            <div class="menu__item" on:click="{()=>reveal()}"><span class="grow truncate">Reveal code</span></div>
        {/if}
        {#if canDelete}
            <div class="menu__item" on:click="{()=>dispatch('delete')}"><span class="grow truncate">Delete record</span></div>
        {/if}
    </div>
</details>
