<script>
    import { onMount } from 'svelte'
    import { fitHeight } from '../../lib/TextareaAutogrow'

    import {
        writablesAsText, requestWritables,
        ignoredAsText, copyGitignore, requestGitignores,
    } from './stores/files'

    let writablesTextareaElement
    let ignoredTextareaElement
    $: fitHeight(writablesTextareaElement, $writablesAsText)
    $: fitHeight(ignoredTextareaElement, $ignoredAsText)

    onMount(() => {
        requestWritables()
        requestGitignores()
    })

</script>

<br>
<div class="settings-row-bg px-6 py-6">

    <div class="bold fg-headerForeground mb-half">Writable directories</div>

    <div class="mb-quaterAndHalf">
    Store parsed view templates, caches, logs and http uploads in local filesystem. <br>
    Type one directory per each line. Paths relative to the root of your repo.
    </div>

    <textarea
        class="font-mono px-half py-quater"
        rows="5"
        bind:value={$writablesAsText}
        bind:this={writablesTextareaElement}
    ></textarea>
</div>

<div class="settings-row-bg px-6 py-6">

    <div class="bold fg-headerForeground mb-half">Dockerignore</div>

    <div class="mb-quaterAndHalf">
    Files to exclude from the sources during build process to keep container image size lightweight and prevent undesired info leaks. <br>
    In case running build process on a local machine, to prevent accidental bloat you should
    <span class="fg-link cursor-pointer"
        on:click={() => copyGitignore()}
    >copy .gitignore contents</span> as well. <br>
    As an alternative to "ignore"-ing you can switch to "allow"-ing. The former is recommended for beginners, the latter requires certain familiarity with the tool.
    </div>

    <textarea
        class="font-mono px-half py-quater"
        rows="5"
        bind:value={$ignoredAsText}
        bind:this={ignoredTextareaElement}
    ></textarea>

</div>
