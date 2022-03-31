<script>

    import { selectedServer } from './stores/distro'

    import {
        availableDocumentRoots, availableFrontControllers,
        selectedDocumentRoot, selectedFrontController,
    } from './stores/server'

    $: askDocumentRootAndFrontController = ['apache', 'unit'].includes($selectedServer.package)

</script>

{#if askDocumentRootAndFrontController}
    <br>
    <div>
        Document root and Front controller
        <br>
        <select bind:value={$selectedDocumentRoot}>
            {#each $availableDocumentRoots as dirname (dirname)}
                <option value={dirname}>{dirname}</option>
            {/each}
        </select>
        <select bind:value={$selectedFrontController}>
            {#each $availableFrontControllers as basename (basename)}
                <option value={basename}>{basename}</option>
            {/each}
        </select>
    </div>
{/if}
