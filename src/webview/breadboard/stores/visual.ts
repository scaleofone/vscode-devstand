import { Writable, writable, get } from 'svelte/store'
import { updateSquareStyle, components } from './breadboard'

export interface Square {
    uuid: string
    cornerY: number
    cornerX: number
    colorIndex: number
    colorHex: string
}

export const squares: Writable<Square[]> = writable([])

export const colors = ['#ee5396', '#00bcd4', '#8a3ffc', '#ffc107', '#03a9f4', '#8bc34a', '#ff9800', '#009688']

components.subscribe(($components) => {
    let updSquares = []
    let $squares = get(squares)
    let usedColorIndexes = []
    function nextColorIndex() {
        for (let i = 0; i < colors.length; i++) {
            if (! usedColorIndexes.includes(i)) {
                return i
            }
        }
        throw 'not enough colors'
    }
    for (let component of $components) {
        let square = $squares.find(s => s.uuid == component.identifier)
        if (square) {
            // merge data
        } else {
            let colorIndex = nextColorIndex()
            square = {
                uuid: component.identifier,
                cornerY: 100,
                cornerX: 200,
                colorIndex,
                colorHex: colors[colorIndex],
            }
        }
        usedColorIndexes.push(square.colorIndex)
        updSquares.push(JSON.parse(JSON.stringify(square)))
    }
    squares.set(updSquares)
    console.log('!!! updSquares')
})


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
        let _squares = get(squares)
        let squareIndex = _squares.findIndex(s => s.uuid == get(grabbingSquareUuid))
        let square = _squares[squareIndex]
        square.cornerY = (get(grabbingCornerY) >= 0 ? get(grabbingCornerY) : 0),
        square.cornerX = (get(grabbingCornerX) >= 0 ? get(grabbingCornerX) : 0)
        _squares.splice(squareIndex, 1, square)
        squares.set(_squares)

        // styles have to be (but they are not) updated automatically after mutation in the store
        get(grabbingSquareElement).style.top = `${square.cornerY}px`
        get(grabbingSquareElement).style.left = `${square.cornerX}px`

        updateSquareStyle(square)

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
