<script>
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
    import DetailDropdown from './controls/DetailDropdown'

    import { extension } from './transport'

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

<details use:DetailDropdown class="dropdown select-none">
    <summary class="fg-icon hover:fg-link cursor-pointer">edit</summary>
    <div class="menu menu--vertical-padding widget-shadow">
        <div class="menu__item" on:click="{()=>dispatch('modify')}"><span class="grow truncate">Modify record</span></div>
        <div class="menu__item" on:click="{()=>dispatch('update')}"><span class="grow truncate">Update record value</span></div>
        <div class="menu__item" on:click="{()=>dispatch('delete')}"><span class="grow truncate">Delete record</span></div>
        {#if canReveal}
            <div class="menu__item" on:click="{()=>reveal()}"><span class="grow truncate">Reveal record</span></div>
        {/if}
    </div>
</details>
