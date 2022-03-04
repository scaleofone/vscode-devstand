<script>
    import { grabbingSquareUuid, handleGrabStartEvent, colorHexForIndex } from './stores/visual'

    /** @type {import('../../BreadboardTypes').Component} */
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
        <div class="height-mono select-none cursor-grab margin-bottom-neg-height-mono"
            on:pointerdown={(event) => {
                handleGrabStartEvent(event, event.target, squareElement, component.identifier)
            }}
            ></div>

        <slot></slot>
</div>
