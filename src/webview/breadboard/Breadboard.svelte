<script>
    import { resultCreateNewComponent, createNewComponent } from './stores/breadboard.js'

    import { extension } from './transport'
    let before, after
    let variableName, targetFile, targetIdentifier
</script>


<input type="text" placeholder="before" bind:value={before}>
<input type="text" placeholder="after"  bind:value={after}>
<button on:click={extension.renameComponent({ before, after })}>renameComponent</button>

<br><br>

<input type="text" placeholder="variableName" bind:value={variableName}>
<input type="text" placeholder="targetFile"  bind:value={targetFile}>
<input type="text" placeholder="targetIdentifier"  bind:value={targetIdentifier}>
<button on:click={extension.addTemplateImport({ variableName, targetFile, targetIdentifier })}>addTemplateImport</button>


<button on:click={createNewComponent}>createNewComponent</button>

<pre>{ JSON.stringify($resultCreateNewComponent, null, 4) }</pre>
