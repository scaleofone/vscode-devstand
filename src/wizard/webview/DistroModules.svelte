<script>

    import { selectedBase } from './stores/base'

    import {
        builtinModules, detectedComposerModules, manualModules,
    } from './stores/modules'

    import iconCheckbox from '@vscode/codicons/src/icons/check.svg'
    import iconChevronDown from '@vscode/codicons/src/icons/chevron-down.svg'
    import iconChevronUp from '@vscode/codicons/src/icons/chevron-up.svg'

    let modulesManualSelectionVisible = false

</script>

<br>
<div>
    <label class="input-checkbox cursor-not-allowed">
        <input type="checkbox" checked disabled id="cbx_builtinModules">
        {@html iconCheckbox}
    </label>
    <label for="cbx_builtinModules">
        Builtin modules preinstalled with PHP {$selectedBase.phpVersion} in {$selectedBase.caption} {$selectedBase.tag}
    </label>

    <div class="comma-list font-family-mono">
        {#each $builtinModules as m } <span>{m}</span> {/each}
    </div>

</div>

<br>
<div>
    <label class="input-checkbox cursor-pointer">
        <input type="checkbox" checked id="cbx_composerModules">
        {@html iconCheckbox}
    </label>
    <label for="cbx_composerModules">
        Required by dependencies in your <span class="font-mono">composer.json</span>
    </label>

    <div class="comma-list font-family-mono">
        {#each $detectedComposerModules as m } <span>{m}</span> {/each}
    </div>

</div>

<br>
<div>
    <label class="input-checkbox cursor-pointer">
        <input type="checkbox" checked id="cbx_manualModules">
        {@html iconCheckbox}
    </label>
    <label for="cbx_manualModules">
        Manually selected
    </label>

    <div class="comma-list font-family-mono">
        {#each $manualModules as m } <span>{m}</span> {/each}
    </div>

</div>

<br>
<div>
    {#if modulesManualSelectionVisible}
        <span class="fg-link cursor-pointer"
            on:click={() => modulesManualSelectionVisible = false }>
            {@html iconChevronUp} Hide modules list
        </span>
    {:else}
        <span class="fg-link cursor-pointer"
            on:click={() => modulesManualSelectionVisible = true }>
            {@html iconChevronDown} Manually select PHP modules
        </span>
    {/if}
</div>
