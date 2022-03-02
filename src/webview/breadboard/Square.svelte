<script>
    import { grabbingSquareUuid, handleGrabStartEvent, colorHexForIndex } from './stores/visual'

    export let component

    $: colorHex = colorHexForIndex(component.colorIndex)

    let squareElement;

</script>

<div bind:this={squareElement}
    class="square"
    class:is-grabbing={ $grabbingSquareUuid === component.identifier }
    style={[
        `top: ${component.cornerY}px`,
        `left: ${component.cornerX}px`,
        `--square-color: ${colorHex}`
    ].join(';')}
    >
        <div class="height-mono select-none cursor-grab" style="min-width: 1rem; background-color: var(--square-color);"
            on:pointerdown={(event) => {
                handleGrabStartEvent(event, event.target, squareElement, component.identifier)
            }}
            ></div>

        <slot></slot>
</div>
