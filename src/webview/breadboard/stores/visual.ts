import { Writable, writable, derived, get } from 'svelte/store'
import { mutateComponentGeometry, components } from './breadboard'

export const colors: Writable<string[]> = writable(['#ee5396', '#00bcd4', '#8a3ffc', '#ffc107', '#03a9f4', '#8bc34a', '#ff9800', '#009688'])

export const usedColorIndexes = derived(components, ($components) => {
    return $components.map(component => component.colorIndex).filter((v, i, a) => a.indexOf(v) === i)
}, [])

export const availableColorIndexes = derived([usedColorIndexes, colors], ([$usedColorIndexes, $colors]) => {
    let result = []
    for (let i = 0; i < $colors.length; i++) {
        if (! $usedColorIndexes.includes(i)) {
            result.push(i)
        }
    }
    return result
}, [])

export function colorHexForIndex(colorIndex: number): string {
    while (colorIndex >= get(colors).length) {
        colorIndex = colorIndex - get(colors).length
    }
    return get(colors)[colorIndex]
}

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
        const cornerY = (get(grabbingCornerY) >= 0 ? get(grabbingCornerY) : 0)
        const cornerX = (get(grabbingCornerX) >= 0 ? get(grabbingCornerX) : 0)

        // styles have to be (but they are not) updated automatically after mutation in the store
        get(grabbingSquareElement).style.top = `${cornerY}px`
        get(grabbingSquareElement).style.left = `${cornerX}px`


        let componentIdentifier = get(grabbingSquareUuid)
        setTimeout(() => mutateComponentGeometry(componentIdentifier, cornerY, cornerX), 400) // in order to .square animation to happen

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
