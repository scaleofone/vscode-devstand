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
            preserveFocus: true,
            preview: true,
            selection: record.vscodeRange,
            viewColumn: 'Beside',
        })
    }
</script>

<details use:DetailDropdown class="dropdown select-none dropdown--having-svg-in-summary">
    <summary class="cursor-pointer">{@html iconDropdown}</summary>
    <div class="menu menu--vertical-padding widget-shadow">
        <div class="menu__item" on:click="{()=>dispatch('modify')}"><span class="grow truncate">Modify record</span></div>
        <div class="menu__item" on:click="{()=>dispatch('delete')}"><span class="grow truncate">Delete record</span></div>
        {#if canReveal}
            <div class="menu__item" on:click="{()=>reveal()}"><span class="grow truncate">Reveal record</span></div>
        {/if}
    </div>
</details>
