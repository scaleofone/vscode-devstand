<script>
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
    import DetailDropdown from './controls/DetailDropdown'
</script>

<details use:DetailDropdown class="dropdown select-none">
    <summary class="fg-icon hover:fg-link cursor-pointer">edit</summary>
    <div class="menu menu--vertical-padding widget-shadow">
        <div class="menu__item" on:click="{()=>dispatch('rename')}"><span class="grow truncate">Rename record</span></div>
        <div class="menu__item" on:click="{()=>dispatch('delete')}"><span class="grow truncate">Delete record</span></div>
    </div>
</details>
