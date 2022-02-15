<script>
    import { extension } from './transport'
    let variableName, targetFile, targetIdentifier
    let variableName2
    let componentIdentifier2, recordIdentifier2, renameRecordIdentifier2
    let componentIdentifier4, recordIdentifier4, recordValue4
    let componentIdentifier5, templateImportVariableName5

    let messageText, showMessagePromise
    let slowOperationPromise
</script>


<button on:click={() => slowOperationPromise = extension.slowOperation() }>invoke slowOperation</button>
<button on:click={() => slowOperationPromise.abort() }>abort slowOperation</button>
{#if typeof slowOperationPromise != 'undefined' }
    {#await slowOperationPromise} waiting...
    {:then result} <div style="color:green">ok {result}</div>
    {:catch error} <div style="color:red">{error}</div>
    {/await}
{/if}

<br><br>
<input type="text" placeholder="messageText" bind:value={messageText}>
<button on:click={() => showMessagePromise = extension.showMessage(messageText) }>showMessage</button>
{#if typeof showMessagePromise != 'undefined' }
    {#await showMessagePromise} waiting...
    {:then} <div style="color:green">ok</div>
    {:catch error}
        <div style="color:red">typeof error = "{typeof error}"</div>
        <div style="color:red">error instanceof Error = {(error instanceof Error)}</div>
        {#if error instanceof Error}
            <div style="color:red">Error.toString() = "{error}"</div>
        {:else}
            <pre style="background-color:#ffc; color:red;">{JSON.stringify(error, null, 2)}</pre>
        {/if}
    {/await}
{/if}

<br><br>

<input type="text" placeholder="componentIdentifier" bind:value={componentIdentifier5}>
<input type="text" placeholder="templateImportVariableName"  bind:value={templateImportVariableName5}>
<button on:click={() => extension.createComponent({ componentIdentifier: componentIdentifier5, templateImportVariableName: templateImportVariableName5 })}>createComponent</button>


<br><br>

<input type="text" placeholder="variableName" bind:value={variableName}>
<input type="text" placeholder="targetFile"  bind:value={targetFile}>
<input type="text" placeholder="targetIdentifier"  bind:value={targetIdentifier}>
<button on:click={() => extension.createTemplateImport({ variableName, targetFile, targetIdentifier })}>createTemplateImport</button>

<br><br>

<input type="text" placeholder="variableName" bind:value={variableName2}>
<button on:click={() => extension.deleteTemplateImport({ variableName: variableName2 })}>deleteTemplateImport</button>

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
