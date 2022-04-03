<script>
    import { grabbingSquareUuid, handleGrabStartEvent, colorHexForIndex, dragoverComponentIdentifier } from './stores/visual'
    import { justCreatedComponentIdentifiers } from './stores/breadboard'

    /** @type {import('../../BreadboardTypes').Component} */
    export let component

    $: colorHex = colorHexForIndex(component.colorIndex)

    /** @type HTMLDivElement */
    let squareElement;

</script>

<div bind:this={squareElement}
    class="square shadow-square"
    data-component-identifier={component.identifier}
    class:is-grabbing={ $grabbingSquareUuid === component.identifier || $justCreatedComponentIdentifiers.includes(component.identifier) }
    class:square--dragover={ $dragoverComponentIdentifier === component.identifier }
    style={[
        `top: ${component.cornerY}px`,
        `left: ${component.cornerX}px`,
        `--square-color: ${colorHex}`
    ].join(';')}
    >
        <div class="height-mono select-none cursor-grab margin-bottom-neg-height-mono"
            data-purpose="squareKnob"
            on:pointerdown={(event) => {
                handleGrabStartEvent(event, event.target, squareElement, component.identifier)
            }}
            ></div>

        <slot></slot>
</div>
