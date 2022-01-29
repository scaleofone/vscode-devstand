<script lang="typescript">
    import { resultCreateNewComponent, createNewComponent } from './stores/breadboard'

    import { extension } from './transport'
    let before, after
    let variableName, targetFile, targetIdentifier
    let variableName2
    let variableName3
    let recordIdentifier1, componentIdentifier1
    let componentIdentifier2, recordIdentifier2, renameRecordIdentifier2
    let componentIdentifier3, recordIdentifier3, updateRecordValue3
    let componentIdentifier4, recordIdentifier4, recordValue4
    let componentIdentifier5, templateImportVariableName5

</script>


<input type="text" placeholder="componentIdentifier" bind:value={componentIdentifier5}>
<input type="text" placeholder="templateImportVariableName"  bind:value={templateImportVariableName5}>
<button on:click={() => extension.createComponent({ componentIdentifier: componentIdentifier5, templateImportVariableName: templateImportVariableName5 })}>createComponent</button>

<br><br>

<input type="text" placeholder="before" bind:value={before}>
<input type="text" placeholder="after"  bind:value={after}>
<button on:click={() => extension.renameComponent({ before, after })}>renameComponent</button>

<br><br>

<input type="text" placeholder="variableName" bind:value={variableName}>
<input type="text" placeholder="targetFile"  bind:value={targetFile}>
<input type="text" placeholder="targetIdentifier"  bind:value={targetIdentifier}>
<button on:click={() => extension.createTemplateImport({ variableName, targetFile, targetIdentifier })}>createTemplateImport</button>

<br><br>

<input type="text" placeholder="variableName" bind:value={variableName2}>
<button on:click={() => extension.deleteTemplateImport({ variableName: variableName2 })}>deleteTemplateImport</button>

<br><br>

<input type="text" placeholder="identifier" bind:value={variableName3}>
<button on:click={() => extension.deleteComponent({ identifier: variableName3 })}>deleteComponent</button>

<br><br>

<input type="text" placeholder="componentIdentifier" bind:value={componentIdentifier1}>
<input type="text" placeholder="recordIdentifier" bind:value={recordIdentifier1}>
<button on:click={() => extension.deleteRecord({ componentIdentifier:componentIdentifier1, recordIdentifier:recordIdentifier1 })}>deleteRecord</button>

<br><br>

<input type="text" placeholder="componentIdentifier" bind:value={componentIdentifier2}>
<input type="text" placeholder="recordIdentifier" bind:value={recordIdentifier2}>
<input type="text" placeholder="renameRecordIdentifier" bind:value={renameRecordIdentifier2}>
<button on:click={() => extension.renameRecord({ componentIdentifier:componentIdentifier2, recordIdentifier:recordIdentifier2, renameRecordIdentifier: renameRecordIdentifier2 })}>renameRecord</button>

<br><br>

<input type="text" placeholder="componentIdentifier" bind:value={componentIdentifier4}>
<input type="text" placeholder="recordIdentifier" bind:value={recordIdentifier4}>
<input type="text" placeholder="recordValue" bind:value={recordValue4}>
<button on:click={() => extension.createRecordValue({ componentIdentifier:componentIdentifier4, recordIdentifier:recordIdentifier4, recordValue: recordValue4 })}>createRecordValue</button>

<br><br>

<input type="text" placeholder="componentIdentifier" bind:value={componentIdentifier3}>
<input type="text" placeholder="recordIdentifier" bind:value={recordIdentifier3}>
<input type="text" placeholder="updateRecordValue" bind:value={updateRecordValue3}>
<button on:click={() => extension.updateRecordValue({ componentIdentifier:componentIdentifier3, recordIdentifier:recordIdentifier3, updateRecordValue: updateRecordValue3 })}>updateRecordValue</button>

<br><br>
<hr>

<button on:click={() => createNewComponent()}>createNewComponent</button>

<pre>{ JSON.stringify($resultCreateNewComponent, null, 4) }</pre>
