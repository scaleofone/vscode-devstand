<script>
    import { top, left, recenter, updateDocument } from './stores/point.js'
    import { resultNewSquare, askForNewSquare } from './stores/squares.js'
    import { throttle } from 'throttle-debounce'

    let pointElement
    const updatePointPosition = throttle(50, (top, left) => {
        if (pointElement) {
            pointElement.style.top = top + 'px'
            pointElement.style.left = left + 'px'
            updateDocument()
        }
    })
    $: updatePointPosition($top, $left)

</script>

<div class="wrapper">

    <input type="range" min="0" max="200" step="1"
        class="axis-left"
        bind:value={$left}
    >

    <br>

    <input type="range" min="0" max="200" step="1"
        class="axis-top"
        bind:value={$top}
    >

    <div class="area">
        <div class="point"
            bind:this={pointElement}
        ></div>
    </div>

    <br>

    <button on:click={recenter}>Recenter</button>

    <br><br>

    <button on:click={askForNewSquare}>askForNewSquare</button>

    <br><br>

    <pre>{ JSON.stringify($resultNewSquare, null, 2) }</pre>

</div>
