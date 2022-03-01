import { Writable, writable, get } from 'svelte/store'
import { updateSquareStyle } from './breadboard'

let preventGrabbing = false

export const zoom: Writable<number> = writable(1)
export const canvasWidth: Writable<number> = writable(1200)
export const canvasHeight: Writable<number> = writable(950)


export const grabbingSquareUuid: Writable<string> = writable('')

const grabbingSquareElement: Writable<HTMLDivElement> = writable(null)
const grabbingCornerOffsetX: Writable<number> = writable(0)
const grabbingCornerOffsetY: Writable<number> = writable(0)
const grabbingCornerX: Writable<number> = writable(0)
const grabbingCornerY: Writable<number> = writable(0)

export function handleGrabStartEvent(event: PointerEvent, knobElement: HTMLDivElement, squareElement: HTMLDivElement, squareUuid: string) {
    if (event.button > 0) return
    grabbingSquareUuid.set(squareUuid)
    grabbingSquareElement.set(squareElement)
    grabbingCornerOffsetX.set(event.offsetX + knobElement.offsetLeft + 1)
    grabbingCornerOffsetY.set(event.offsetY + knobElement.offsetTop + 1)
    grabbingCornerX.set(toCornerX(event.clientX))
    grabbingCornerY.set(toCornerY(event.clientY))
}

export function onContainerPointerMove(event: PointerEvent) {
    if (get(grabbingSquareUuid) && ! preventGrabbing) {
        grabbingCornerX.set(toCornerX(event.clientX))
        grabbingCornerY.set(toCornerY(event.clientY))
        get(grabbingSquareElement).style.left = get(grabbingCornerX).toString() + 'px'
        get(grabbingSquareElement).style.top = get(grabbingCornerY).toString() + 'px'
        scrollSurfaceWhenSquareDraggedOutOfVieport(
            event.clientX > window.innerWidth - 100,    // toRight ?
            event.clientY > window.innerHeight - 100,   // toBottom ?
            event.clientX < 100,                        // toLeft ?
            event.clientY < 100                         // toTop ?
        )
    }
}

export function onContainerPointerUp(event: PointerEvent) {
    if (get(grabbingSquareUuid)) {
        updateSquareStyle({
            uuid: get(grabbingSquareUuid),
            cornerX: (get(grabbingCornerX) >= 0 ? get(grabbingCornerX) : 0),
            cornerY: (get(grabbingCornerY) >= 0 ? get(grabbingCornerY) : 0),
        })

        // DO I NEED THIS ?
        // styles have to be (but they are not) updated automatically after vuex mutation
        // if (parseInt(grabbingSquareElement.style.left) < 0) grabbingSquareElement.style.left = '0px'
        // if (parseInt(grabbingSquareElement.style.top) < 0) grabbingSquareElement.style.top = '0px'

        grabbingSquareUuid.set('')
        grabbingSquareElement.set(null)
        grabbingCornerOffsetX.set(0)
        grabbingCornerOffsetY.set(0)
        grabbingCornerX.set(0)
        grabbingCornerY.set(0)
    }
}

function scrollSurfaceWhenSquareDraggedOutOfVieport(toRight: boolean, toBottom: boolean, toLeft: boolean, toTop: boolean) {
    if (toRight || toBottom || toLeft || toTop) {
        preventGrabbing = qs.surface.scrollTop > 50  // avoid the case when the dragged square already resides close the top of the map
        setTimeout(() => preventGrabbing = false, 20)
        qs.surface.scrollBy({
            top: toBottom ? 5 : (toTop ? -5 : 0),
            left: toRight ? 5 : (toLeft ? -5 : 0),
            behavior: 'auto',
        })
    }
}

function toCornerX(clientX: number): number {
    return Math.floor(clientX / get(zoom))
        - Math.floor(get(grabbingCornerOffsetX))
        - Math.floor(qs.surface.offsetLeft / get(zoom))
        + Math.floor(qs.surface.scrollLeft / get(zoom))
}
function toCornerY(clientY: number): number {
    return Math.floor(clientY / get(zoom))
        - Math.floor(get(grabbingCornerOffsetY))
        - Math.floor(qs.surface.offsetTop / get(zoom))
        + Math.floor(qs.surface.scrollTop / get(zoom))
}

const qs = {
    get surface(): HTMLDivElement {
        if (! this._surface) {
            this._surface = document.querySelector('.map-surface-container')
        }
        return this._surface
    },
    _surface: undefined,
}
