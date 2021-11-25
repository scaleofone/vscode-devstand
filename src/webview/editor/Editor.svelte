<script>
    import { throttle } from 'throttle-debounce'

    import { getContext } from 'svelte'
    const vscodeApi = getContext('vscodeApi')

    import '../vscode.css'
    import './editor.css'
    
    let top = 0
    let left = 0
    let pointElement

    const updatePointPosition = throttle(20, (top, left) => {
        if (pointElement) {
            pointElement.style.top = top + 'px'
            pointElement.style.left = left + 'px'
        }
    })
    $: updatePointPosition(top, left)

    const saveEditor = () => {
        vscodeApi.postMessage({ command: 'info', text: `top=${top}, left=${left}`})
    }
    
    const recenter = () => {
        left = top = 100
    }

</script>

<div class="wrapper">

    <input type="range" min="0" max="200" step="1"
        class="axis-left"
        bind:value={left}
    >
    
    <br>
    
    <input type="range" min="0" max="200" step="1"
        class="axis-top"
        bind:value={top}
    >
    
    <div class="area">
        <div class="point"
            bind:this={pointElement}
        ></div>
    </div>

    <br>

    <button on:click={saveEditor}>Save editor</button>
    
    <br><br>
    
    <button on:click={recenter}>Recenter</button>
</div>
