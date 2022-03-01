<script>
    import { zoom } from './stores/visual'

    import iconPlus from '@vscode/codicons/src/icons/add.svg'
    import iconMinus from '@vscode/codicons/src/icons/chrome-minimize.svg'

    const variations = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    $: offset = variations.indexOf($zoom)
    $: zoomInEnabled = offset < variations.length - 1
    $: zoomOutEnabled = offset > 0

    function zoomIn() {
        if (zoomInEnabled) {
            zoom.set(variations[offset + 1])
        }
    }
    function zoomOut() {
        if (zoomOutEnabled) {
            zoom.set(variations[offset - 1])
        }
    }

    let wheelMileage = 0
    function onWheel(event) {
        event.preventDefault()
        wheelMileage += event.deltaY
        if (wheelMileage > 100) {
            wheelMileage = 0
            zoomIn()
        }
        if (wheelMileage < -100) {
            wheelMileage = 0
            zoomOut()
        }
    }

</script>

<div class="flex" style="gap: 1px; --button-size: 40px"
    on:wheel={onWheel}
    >
    <button type="button"
        class="select-none flex items-center justify-center" style="width: var(--button-size); height: var(--button-size);"
        disabled={!zoomOutEnabled}
        on:click={() => zoomOut()}
    >{@html iconMinus}</button>
    <button type="button"
        class="select-none flex items-center justify-center" style="width: var(--button-size); height: var(--button-size);"
        disabled={!zoomInEnabled}
        on:click={() => zoomIn()}
    >{@html iconPlus}</button>
</div>
