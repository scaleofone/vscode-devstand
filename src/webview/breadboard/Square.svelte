<script>
    import { get } from 'svelte/store'
    import { components } from './stores/breadboard'
    import { grabbingSquareUuid, handleGrabStartEvent, colorHexForIndex } from './stores/visual'

    export let identifier = ''
    $: component = get(components).find(c => c.identifier == identifier)
    $: colorHex = colorHexForIndex(component.colorIndex)

    let squareElement;

</script>

<div bind:this={squareElement}
    class="square"
    class:is-grabbing={ $grabbingSquareUuid === identifier }
    style={[
        `top: ${component.cornerY}px`,
        `left: ${component.cornerX}px`,
        `--square-color: ${colorHex}`
    ].join(';')}
    >
        <div class="height-mono select-none cursor-grab" style="min-width: 1rem; background-color: var(--square-color);"
            on:pointerdown={(event) => {
                handleGrabStartEvent(event, event.target, squareElement, identifier)
            }}
            ></div>

        <slot></slot>
</div>
