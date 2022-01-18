<script>
    import { resultCreateNewComponent, createNewComponent } from './stores/breadboard.js'

    import { extension } from './transport'
    let before, after
    let variableName, targetFile, targetIdentifier
    let variableName2
    let variableName3
    let recordIdentifier1, componentIdentifier1
</script>


<input type="text" placeholder="before" bind:value={before}>
<input type="text" placeholder="after"  bind:value={after}>
<button on:click={extension.renameComponent({ before, after })}>renameComponent</button>

<br><br>

<input type="text" placeholder="variableName" bind:value={variableName}>
<input type="text" placeholder="targetFile"  bind:value={targetFile}>
<input type="text" placeholder="targetIdentifier"  bind:value={targetIdentifier}>
<button on:click={extension.addTemplateImport({ variableName, targetFile, targetIdentifier })}>addTemplateImport</button>

<br><br>

<input type="text" placeholder="variableName" bind:value={variableName2}>
<button on:click={extension.removeTemplateImport({ variableName: variableName2 })}>removeTemplateImport</button>

<br><br>

<input type="text" placeholder="identifier" bind:value={variableName3}>
<button on:click={extension.removeComponent({ identifier: variableName3 })}>removeComponent</button>

<br><br>

<input type="text" placeholder="componentIdentifier" bind:value={componentIdentifier1}>
<input type="text" placeholder="recordIdentifier" bind:value={recordIdentifier1}>
<button on:click={extension.removeRecord({ componentIdentifier:componentIdentifier1, recordIdentifier:recordIdentifier1 })}>removeRecord</button>

<br><br>
<hr>

<button on:click={createNewComponent}>createNewComponent</button>

<pre>{ JSON.stringify($resultCreateNewComponent, null, 4) }</pre>
