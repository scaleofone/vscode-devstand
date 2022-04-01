<script>

    import {
        availableServers, selectedServerPackage,
        availableDocumentRoots, availableFrontControllers,
        selectedDocumentRoot, selectedFrontController,
    } from './stores/server'

    import iconRadio from '@vscode/codicons/src/icons/circle-filled.svg'

    $: askDocumentRootAndFrontController = $selectedServerPackage && ['apache', 'unit'].includes($selectedServerPackage)

    let serverDescriptionsVisible = false

</script>

<div class="settings-row-padding settings-row-bg">

    <div class="bold fg-headerForeground">Application server</div>

    <br>
    <div>
    {#each $availableServers as server (server)}
        <label class="input-radio cursor-pointer">
            <input type="radio" bind:group={$selectedServerPackage} value={server.package} id={`serverPackage_${server.package}`}>
            {@html iconRadio}
        </label>
        <label for={`serverPackage_${server.package}`}>{server.caption}</label>
    {/each}

    <span class="fg-link cursor-pointer"
        on:click={() => serverDescriptionsVisible = ! serverDescriptionsVisible}
    >What's the difference?</span>

    </div>



{#if serverDescriptionsVisible}
    <br>
    <div>

        {#each $availableServers as server (server)}
            <div>
                <label class="input-radio cursor-pointer">
                    <input type="radio" bind:group={$selectedServerPackage} value={server.package} id={`serverPackage_${server.package}`}>
                    {@html iconRadio}
                </label>
                <label for={`serverPackage_${server.package}`}>{server.caption}</label>
                {#if server.recommended}
                    <span style="color:green">Recommended</span>
                {/if}
            </div>
            <div>{@html server.description}</div>
        {/each}

    </div>
{/if}

</div>

{#if askDocumentRootAndFrontController}
    <div class="settings-row-padding settings-row-bg">
        <div class="bold fg-headerForeground">Document root and Front controller</div>
        <br>
        <div>
            <div class="inline-flex">
                <select
                    class="style-input-text font-mono"
                    bind:value={$selectedDocumentRoot}>
                    {#each $availableDocumentRoots as dirname (dirname)}
                        <option value={dirname}>{dirname}</option>
                    {/each}
                </select>
                <select
                    class="style-input-text font-mono"
                    bind:value={$selectedFrontController}>
                    {#each $availableFrontControllers as basename (basename)}
                        <option value={basename}>{basename}</option>
                    {/each}
                </select>
            </div>
        </div>
    </div>
{/if}
