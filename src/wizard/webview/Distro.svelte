<script>
    import { selectedBase, selectedPhpVersion, selectedBaseCaption, selectedBaseTag, availablePhpVersions, availableBaseCaptions, availableBaseTags } from './stores/distro'

    import iconCheckbox from '@vscode/codicons/src/icons/check.svg'
    import iconRadio from '@vscode/codicons/src/icons/circle-filled.svg'

</script>

<div>

    <div>
        PHP version
        <br>
        {#each $availablePhpVersions as phpVersion}
            <label class="input-radio">
                <input type="radio" bind:group={$selectedPhpVersion} value={phpVersion} id={phpVersion}>
                {@html iconRadio}
            </label>
            <label for={phpVersion}>{phpVersion}</label>
        {/each}
    </div>

    {#if $availableBaseCaptions.length > 0}
        <br>
        <div>
            Base image
            <br>
            {#each $availableBaseCaptions as baseCaption (baseCaption)}
                <label class="input-radio">
                    <input type="radio" bind:group={$selectedBaseCaption} value={baseCaption} id={baseCaption}>
                    {@html iconRadio}
                </label>
                <label for={baseCaption}>{baseCaption}</label>
            {/each}
        </div>
    {/if}

    {#if $availableBaseTags.length > 0}
        <br>
        <div>
            Base tag
            <br>
            {#each $availableBaseTags as baseTag (baseTag)}
                <label class="input-radio">
                    <input type="radio" bind:group={$selectedBaseTag} value={baseTag} id={baseTag}>
                    {@html iconRadio}
                </label>
                <label for={baseTag}>{baseTag}</label>
            {/each}
        </div>
    {/if}


    {#if $selectedBase}
        <br>
        <div>
            <label class="input-checkbox">
                <input type="checkbox" checked id="cbx_builtinModules">
                {@html iconCheckbox}
            </label>
            <label for="cbx_builtinModules">
                Builtin modules preinstalled with PHP {$selectedBase.phpVersion} in {$selectedBase.caption} {$selectedBase.tag}
            </label>

            <div class="comma-list">
                {#each $selectedBase.builtinModules as builtinModule } <span>{builtinModule}</span> {/each}
            </div>

        </div>
    {/if}

    <br><br>
    <pre>{ JSON.stringify({
        selectedPhpVersion: $selectedPhpVersion,
        selectedBaseCaption: $selectedBaseCaption,
        selectedBaseTag: $selectedBaseTag,
    }, null, 2) }</pre>
</div>
