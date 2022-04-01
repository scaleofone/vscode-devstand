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

<div class="settings-row-padding settings-row-bg" tabindex="0">

    <div class="bold fg-headerForeground">PHP modules</div>

<div class="mt-quaterAndHalf">






    <div class="flex items-center">
    <label class="input-checkbox cursor-not-allowed">
        <input type="checkbox" checked disabled id="cbx_builtinModules">
        {@html iconCheckbox}
    </label>
    <label class="pl-half cursor-pointer" for="cbx_builtinModules">
        Builtin modules preinstalled with PHP {$selectedBase.phpVersion} in {$selectedBase.caption} {$selectedBase.tag}
    </label>
    </div>

    <div class="ml-checkbox pl-half comma-list font-family-mono">
        {#each $builtinModules as m } <span>{m}</span> {/each}
    </div>

</div>




<br>
<div>
    <div class="flex items-center">
    <label class="input-checkbox cursor-pointer">
        <input type="checkbox" checked id="cbx_composerModules">
        {@html iconCheckbox}
    </label>
    <label class="pl-half cursor-pointer" for="cbx_composerModules">
        Required by dependencies in your <span class="font-mono">composer.json</span>
    </label>
    </div>

    <div class="ml-checkbox pl-half comma-list font-family-mono">
        {#each $detectedComposerModules as m } <span>{m}</span> {/each}
    </div>

</div>

<br>
<div>
    <div class="flex items-center">
    <label class="input-checkbox cursor-pointer">
        <input type="checkbox" checked id="cbx_manualModules">
        {@html iconCheckbox}
    </label>
    <label class="pl-half cursor-pointer" for="cbx_manualModules">
        Manually selected
    </label>
    </div>

    <div class="ml-checkbox pl-half comma-list font-family-mono">
        {#each $manualModules as m } <span>{m}</span> {/each}
    </div>

</div>

<br>
<div style="margin-left: 2px;">
    {#if modulesManualSelectionVisible}
        <span class="fg-link cursor-pointer inline-flex items-center"
            on:click={() => modulesManualSelectionVisible = false }>
            {@html iconChevronUp}
            <span class="pl-half">Hide modules list</span>
        </span>
    {:else}
        <span class="fg-link cursor-pointer inline-flex items-center"
            on:click={() => modulesManualSelectionVisible = true }>
            {@html iconChevronDown}
            <span class="pl-half">Manually select PHP modules</span>
        </span>
    {/if}
</div>

</div>
