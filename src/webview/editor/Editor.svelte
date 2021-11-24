<script>
    import '../vscode.css';
    import './editor.css';
    
    let counter = 10;

    const increment = (event) => {
        counter++
    }
    const decrement = (event) => {
        counter--
    }
</script>

<div>
    Editor counter: 
    <pre class="d-inline-block">{ counter }</pre> 
    <button class="d-inline-block w-auto" on:click={decrement}> - </button> 
    <button class="d-inline-block w-auto" on:click={increment}> + </button>
</div>
