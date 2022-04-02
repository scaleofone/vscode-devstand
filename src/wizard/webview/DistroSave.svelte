<script>

    import {
        openedFromFolderPath, workspaceFolderPath,
        performSave,
    } from './stores/distro'

    $: showLocation = $workspaceFolderPath && $workspaceFolderPath != $openedFromFolderPath
    $: locationToShow = showLocation ? $openedFromFolderPath.replace($workspaceFolderPath, '.') : $workspaceFolderPath

</script>

<div class="settings-row-padding">
    <div class="flex items-center gap-x-one">
        <div>
            <button class="inline-block" style="padding-right: 1rem; padding-left: 1rem;"
                on:click={() => performSave()}
            >Create Dockerfile</button>
        </div>

        {#if showLocation}
            <div>
                <span>in this directory: <span class="font-family-mono">{locationToShow}</span></span>
            </div>
        {/if}
    </div>
</div>
