<script>

    import {
        availableServers, selectedServerPackage,
        availableDocumentRoots, availableFrontControllers,
        selectedDocumentRoot, selectedFrontController,
        exposedPort,
    } from './stores/server'

    import iconRadio from '@vscode/codicons/src/icons/circle-filled.svg'

    $: askDocumentRootAndFrontController = !! $selectedServerPackage
    $: askPort = !! $selectedServerPackage

    let serverDescriptionsVisible = false

    let docrootCollapsed = true

    let portCollapsed = false

</script>

<div class="settings-row-padding settings-row-bg" tabindex="0">

    <div class="bold fg-headerForeground">Application server</div>

    <div class="flex gap-x-one mt-quaterAndHalf">
    {#each $availableServers as server (server)}
    <div class="flex items-center">

        <label class="input-radio cursor-pointer">
            <input type="radio" bind:group={$selectedServerPackage} value={server.package} id={`serverPackage_${server.package}`}>
            {@html iconRadio}
        </label>
        <label class="pl-half cursor-pointer" for={`serverPackage_${server.package}`}>{server.caption}</label>

    </div>
    {/each}

    <span class="fg-link cursor-pointer"
        hidden
        on:click={() => serverDescriptionsVisible = ! serverDescriptionsVisible}
    >What's the difference?</span>

    </div>



{#if serverDescriptionsVisible}

    <div>
        <br>

        {#each $availableServers as server (server)}

            <div class="flex items-center mt-half">
                <label class="input-radio cursor-pointer">
                    <input type="radio" bind:group={$selectedServerPackage} value={server.package} id={`serverPackage_${server.package}`}>
                    {@html iconRadio}
                </label>
                <label class="pl-half cursor-pointer" for={`serverPackage_${server.package}`}>{server.caption}</label>
                {#if server.recommended}
                    <span class="pl-half" style="color:green">Recommended</span>
                {/if}
            </div>
            <div class="mt-quater ml-radio pl-half">{@html server.description}</div>
        {/each}

    </div>
{/if}

</div>

{#if askPort}
    <div class="settings-row-padding settings-row-bg" tabindex="0">

        <div class="bold fg-headerForeground"
            class:settings-row-header--collapsed={portCollapsed}
            on:click={() => portCollapsed = false}
            >Exposed port</div>

        <div class="mt-quaterAndHalf" hidden={portCollapsed} >
            <div class="inline-flex">
                <input type="number"
                    bind:value={$exposedPort}
                >
            </div>
        </div>

    </div>
{/if}

{#if askDocumentRootAndFrontController}
    <div class="settings-row-padding settings-row-bg" tabindex="0">

        <div class="bold fg-headerForeground"
            class:settings-row-header--collapsed={docrootCollapsed}
            on:click={() => docrootCollapsed = false}
            >Document root and Front controller</div>

        <div class="mt-one" hidden={docrootCollapsed} >
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
