<script>
    import { resultCreateNewComponent, createNewComponent } from './stores/breadboard.js'
</script>

<button on:click={createNewComponent}>createNewComponent</button>

<pre>{ JSON.stringify($resultCreateNewComponent, null, 4) }</pre>
