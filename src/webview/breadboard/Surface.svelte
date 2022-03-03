<script>
    import { canvasWidth, canvasHeight } from './stores/canvas'

    import {
        zoom,
        grabbingSquareUuid,
        onContainerPointerMove, onContainerPointerUp
    } from './stores/visual'

</script>

<div class="map-surface-container map-bg-image bg-scrollable"
    class:cursor-grabbing-everywhere={ !! $grabbingSquareUuid }
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

    </div>
</div>
