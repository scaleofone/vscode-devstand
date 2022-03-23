<script>
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
    import DetailDropdown from './controls/DetailDropdown'
    import iconDropdown from '@vscode/codicons/src/icons/ellipsis.svg'

    import { extension } from './transport'

    /** @type {import('../../BreadboardTypes').Component} */
    export let component

    $: canReveal = 'vscodeRange' in component
    function reveal() {
        extension.openDocument({
            preserveFocus: false,
            preview: false,
            selection: component.vscodeRange,
            viewColumn: 'Beside',
        })
    }

    let canDelete = true
</script>

<details use:DetailDropdown class="dropdown select-none">
    <summary class="button-with-icon cursor-pointer svg-rotate-90">{@html iconDropdown}</summary>
    <div class="menu menu--vertical-padding widget-shadow" style="max-width:300px">
        <div class="menu__item" on:click="{()=>dispatch('rename')}"><span class="grow truncate">Rename</span></div>
        {#if canReveal}
            <div class="menu__item" on:click="{()=>reveal()}"><span class="grow truncate">Reveal code</span></div>
        {/if}
        {#if canDelete}
            <div class="menu__item" on:click="{()=>dispatch('delete')}"><span class="grow truncate">Delete component</span></div>
        {/if}
    </div>
</details>
