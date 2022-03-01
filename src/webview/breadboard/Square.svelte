<script>
    import { get } from 'svelte/store'
    import { grabbingSquareUuid, handleGrabStartEvent, squares } from './stores/visual'

    export let identifier = ''
    $: square = get(squares).find(s => s.uuid == identifier)

    let squareElement;

</script>

<div bind:this={squareElement}
    class="square"
    class:is-grabbing={ $grabbingSquareUuid === square.uuid }
    style={[
        `top: ${square.cornerY}px`,
        `left: ${square.cornerX}px`,
        `--square-color: ${square.colorHex}`
    ].join(';')}
    >
        <div class="height-mono select-none cursor-grab" style="min-width: 1rem; background-color: var(--square-color);"
            on:pointerdown={(event) => {
                handleGrabStartEvent(event, event.target, squareElement, square.uuid)
            }}
            ></div>

        <slot></slot>
</div>
