<script>
    import { onMount } from 'svelte'

    import {
        writablesAsText, requestWritables,
        ignoredAsText, copyGitignore, requestGitignores,
    } from './stores/files'

    onMount(() => {
        requestWritables()
        requestGitignores()
    })

</script>

<br>
<div>
    Writable directories
    <br>
    Store parsed view templates, caches, logs and http uploads in local filesystem. <br>
    Type one directory per each line. Paths relative to the root of your repo.
    <br>
    <textarea
        class="font-mono"
        rows="10"
        bind:value={$writablesAsText}
    ></textarea>
</div>

<br>
<div>
    Dockerignore
    <br>
    Files to exclude from the sources during build process to keep container image size lightweight and prevent undesired info leaks. <br>
    In case running build process on a local machine, to prevent accidental bloat you should
    <span class="fg-link cursor-pointer"
        on:click={() => copyGitignore()}
    >copy .gitignore contents</span> as well. <br>
    As an alternative to "ignore"-ing you can switch to "allow"-ing. The former is recommended for beginners, the latter requires certain familiarity with the tool.
    <br>
    <textarea
        class="font-mono"
        rows="20"
        bind:value={$ignoredAsText}
    ></textarea>
</div>
