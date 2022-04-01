<script>

    import {
        availablePhpVersions, availableBaseCaptions, availableBaseTags,
        selectedPhpVersion, selectedBaseCaption, selectedBaseTag,
    } from './stores/base'

    import iconRadio from '@vscode/codicons/src/icons/circle-filled.svg'

</script>

<div class="settings-row-padding settings-row-bg" tabindex="0">

<div>
    PHP version
    <br>
    {#each $availablePhpVersions as phpVersion}
        <label class="input-radio cursor-pointer">
            <input type="radio" bind:group={$selectedPhpVersion} value={phpVersion} id={`phpVersion_${phpVersion}`}>
            {@html iconRadio}
        </label>
        <label for={`phpVersion_${phpVersion}`}>{phpVersion}</label>
    {/each}
</div>

{#if $availableBaseCaptions.length > 0}
    <br>
    <div>
        Base image
        <br>
        {#each $availableBaseCaptions as baseCaption (baseCaption)}
            <label class="input-radio cursor-pointer">
                <input type="radio" bind:group={$selectedBaseCaption} value={baseCaption} id={`baseCaption_${baseCaption}`}>
                {@html iconRadio}
            </label>
            <label for={`baseCaption_${baseCaption}`}>{baseCaption}</label>
        {/each}
    </div>
{/if}

{#if $availableBaseTags.length > 0}
    <br>
    <div>
        Base tag
        <br>
        {#each $availableBaseTags as baseTag (baseTag)}
            <label class="input-radio cursor-pointer">
                <input type="radio" bind:group={$selectedBaseTag} value={baseTag} id={`baseTag_${baseTag}`}>
                {@html iconRadio}
            </label>
            <label for={`baseTag_${baseTag}`}>{baseTag}</label>
        {/each}
    </div>
{/if}

</div>
