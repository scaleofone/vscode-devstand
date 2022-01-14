<script>
    import { resultCreateNewComponent, createNewComponent } from './stores/breadboard.js'

    import { extension } from './transport'
    let before, after
</script>


<input type="text" placeholder="before" bind:value={before}>
<input type="text" placeholder="after"  bind:value={after}>
<button on:click={extension.renameComponent({ before, after })}>renameComponent</button>


<button on:click={createNewComponent}>createNewComponent</button>

<pre>{ JSON.stringify($resultCreateNewComponent, null, 4) }</pre>
