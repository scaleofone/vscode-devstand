<script>
    import { grabbingSquareUuid, handleGrabStartEvent } from './stores/visual'

    let squareUuid = Math.random().toString().substring(2)
    let style_corner_y = 100
    let style_corner_x = 200

    let squareElement;

</script>

<div bind:this={squareElement}
    class="square"
    class:is-grabbing={ $grabbingSquareUuid === squareUuid }
    style={[
        `top: ${style_corner_y}px`,
        `left: ${style_corner_x}px`,
    ].join(';')}
    >
        <div class="height-mono select-none cursor-grab" style="min-width: 1rem; background-color: orange;"
            on:pointerdown={(event) => {
                handleGrabStartEvent(event, event.target, squareElement, squareUuid)
            }}
            ></div>

        <slot></slot>
</div>
