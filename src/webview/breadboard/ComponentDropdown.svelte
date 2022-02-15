<script>
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
    import DetailDropdown from './controls/DetailDropdown'
    import iconDropdown from '@vscode/codicons/src/icons/tools.svg'

    import { extension } from './transport'

    export let component

    $: canReveal = 'vscodeRange' in component
    function reveal() {
        extension.openDocument({
            preserveFocus: true,
            preview: true,
            selection: component.vscodeRange,
            viewColumn: 'Beside',
        })
    }
</script>

<details use:DetailDropdown class="dropdown select-none">
    <summary class="fg-icon hover:fg-link cursor-pointer">{@html iconDropdown}</summary>
    <div class="menu menu--vertical-padding widget-shadow" style="max-width:300px">
        <div class="menu__item" on:click="{()=>dispatch('rename')}"><span class="grow truncate">Rename component</span></div>
        <div class="menu__item" on:click="{()=>dispatch('delete')}"><span class="grow truncate">Delete component</span></div>
        {#if canReveal}
            <div class="menu__item" on:click="{()=>reveal()}"><span class="grow truncate">Reveal component</span></div>
        {/if}
    </div>
</details>
