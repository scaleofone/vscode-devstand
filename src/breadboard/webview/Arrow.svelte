<script>
    import { grabbingSquareUuidDelayed, grabbingCornerY, grabbingCornerX } from './stores/visual'

    /** @type {import('./stores/arrows').Arrow} */
    export let arrow

    let fromY, fromXLeft, fromXRight, fromX, useXRightForFrom
    let toY, toXLeft, toXRight, toX, useXRightForTo
    let isAnimated = false
    let dAttribute = ''

    $: {
        isAnimated = $grabbingSquareUuidDelayed == arrow.fromComponentIdentifier || $grabbingSquareUuidDelayed == arrow.toComponentIdentifier

        fromY = ($grabbingSquareUuidDelayed == arrow.fromComponentIdentifier && $grabbingCornerY ? $grabbingCornerY : arrow.fromComponentCornerY) + arrow.fromOffsetY
        fromXLeft = ($grabbingSquareUuidDelayed == arrow.fromComponentIdentifier && $grabbingCornerX ? $grabbingCornerX : arrow.fromComponentCornerX)
        fromXRight = fromXLeft + arrow.fromOffsetXRight
        toY = ($grabbingSquareUuidDelayed == arrow.toComponentIdentifier && $grabbingCornerY ? $grabbingCornerY : arrow.toComponentCornerY) + arrow.toOffsetY
        toXLeft = ($grabbingSquareUuidDelayed == arrow.toComponentIdentifier && $grabbingCornerX ? $grabbingCornerX : arrow.toComponentCornerX)
        toXRight = toXLeft + arrow.toOffsetXRight

        useXRightForFrom = toXLeft > fromXRight
        fromX = useXRightForFrom ? fromXRight : fromXLeft
        useXRightForTo = toXRight < fromXLeft
        toX = useXRightForTo ? toXRight : toXLeft

        if (useXRightForFrom || useXRightForTo) {

            dAttribute = [
                'M',
                fromX, fromY,
                    'C',
                    (fromX + (toX > fromX ? 1 : -1) * Math.max(50, 0.5 * Math.abs(toX - fromX))),
                    fromY,
                    (toX - (toX > fromX ? 1 : -1) * Math.max(50, 0.5 * Math.abs(toX - fromX))),
                    toY,
                toX, toY
            ].join(' ')

        } else {

            dAttribute = [
                'M',
                fromX, fromY,
                    'C',
                    (fromX - (toX > fromX ? 40 : Math.max(40, Math.abs(toX - fromX)))),
                    fromY,
                    (toX - (toX > fromX ? Math.max(40, Math.abs(toX - fromX)) : 40)),
                    toY,
                toX, toY
            ].join(' ')

        }
    }
</script>

<path
    d={dAttribute}
    stroke={arrow.color}
    class:animated={isAnimated}
    fill="none"
    stroke-width="1"
/>
