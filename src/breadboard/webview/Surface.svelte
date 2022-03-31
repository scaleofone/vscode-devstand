<script>
    import { canvasWidth, canvasHeight } from './stores/canvas'
    import { arrows } from './stores/arrows'

    import Arrow from './Arrow.svelte'
    import Trolley from './Trolley.svelte'

    import {
        zoom,
        grabbingSquareUuid, grabbingVariableUuid,
        onContainerPointerMove, onContainerPointerUp
    } from './stores/visual'

</script>

<div class="map-surface-container bg-dots bg-scrollable"
    class:cursor-grabbing-everywhere={ $grabbingSquareUuid || $grabbingVariableUuid }
    style={[
        `background-size: ${ 100 * $zoom }px`,
    ].join(';')}
    on:pointermove={onContainerPointerMove}
    on:pointerup={onContainerPointerUp}
    >

    <div class="map-surface"
        style={[
            `transform: scale( ${ $zoom } , ${ $zoom } )`,
            `width: ${ $canvasWidth }px`,
            `height: ${ $canvasHeight }px`,
        ].join(';')}
        >

        <slot></slot>

        <svg style="z-index: -1;" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {#each $arrows as arrow (arrow)}
                <Arrow
                    arrow={arrow}
                />
            {/each}
        </svg>

        <div id="grabbing-reference-view" style="position: absolute; z-index: 100">
            {#if $grabbingVariableUuid }
                <Trolley />
            {/if}
        </div>

    </div>
</div>
