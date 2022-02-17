<script>
    import { extension } from './transport'

    let messageText, showMessagePromise
    let slowOperationPromise
</script>

<br>
<details class="inline-block">
    <summary class="cursor-pointer hover:fg-link select-none">Operations</summary>
    <br>
    <div style="min-width: 400px;">


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

</div>
<br><br>
</details>
