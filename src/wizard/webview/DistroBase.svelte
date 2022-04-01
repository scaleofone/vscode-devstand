<script>

    import {
        availablePhpVersions, availableBaseCaptions, availableBaseTags,
        selectedPhpVersion, selectedBaseCaption, selectedBaseTag,
    } from './stores/base'

    import iconRadio from '@vscode/codicons/src/icons/circle-filled.svg'

</script>

<div class="settings-row-padding settings-row-bg" tabindex="0">

<div>

    <div class="bold fg-headerForeground">PHP version</div>

    <div class="flex gap-x-one mt-quaterAndHalf">
    {#each $availablePhpVersions as phpVersion}
    <div class="flex items-center">

        <label class="input-radio cursor-pointer">
            <input type="radio" bind:group={$selectedPhpVersion} value={phpVersion} id={`phpVersion_${phpVersion}`}>
            {@html iconRadio}
        </label>
        <label class="pl-half cursor-pointer" for={`phpVersion_${phpVersion}`}>{phpVersion}</label>

    </div>
    {/each}
    </div>
</div>

{#if $availableBaseCaptions.length > 0}
    <br>
    <div>
        <div class="bold fg-headerForeground">Base image</div>

        <div class="flex gap-x-one mt-quaterAndHalf">
        {#each $availableBaseCaptions as baseCaption (baseCaption)}
        <div class="flex items-center">

            <label class="input-radio cursor-pointer">
                <input type="radio" bind:group={$selectedBaseCaption} value={baseCaption} id={`baseCaption_${baseCaption}`}>
                {@html iconRadio}
            </label>
            <label class="pl-half cursor-pointer" for={`baseCaption_${baseCaption}`}>{baseCaption}</label>

        </div>
        {/each}
        </div>

    </div>
{/if}

{#if $availableBaseTags.length > 0}
    <br>
    <div>
        <div class="bold fg-headerForeground">Base tag</div>

        <div class="flex gap-x-one mt-quaterAndHalf">
        {#each $availableBaseTags as baseTag (baseTag)}
        <div class="flex items-center">

            <label class="input-radio cursor-pointer">
                <input type="radio" bind:group={$selectedBaseTag} value={baseTag} id={`baseTag_${baseTag}`}>
                {@html iconRadio}
            </label>
            <label class="pl-half cursor-pointer" for={`baseTag_${baseTag}`}>{baseTag}</label>

        </div>
        {/each}
        </div>
    </div>
{/if}

</div>
