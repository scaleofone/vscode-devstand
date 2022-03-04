<script>
    import { canvasWidth, canvasHeight } from './stores/canvas'

    import Trolley from './Trolley.svelte'

    import {
        zoom,
        grabbingSquareUuid, grabbingVariableUuid,
        onContainerPointerMove, onContainerPointerUp
    } from './stores/visual'

</script>

<div class="map-surface-container map-bg-image bg-scrollable"
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


        <div id="grabbing-reference-view" style="position: absolute; z-index: 100">
            {#if $grabbingVariableUuid }
                <Trolley />
            {/if}
        </div>

    </div>
</div>
