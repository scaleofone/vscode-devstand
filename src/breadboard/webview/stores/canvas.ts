import { throttle } from 'throttle-debounce'
import { Subscriber, Writable, writable, derived, get, Readable } from 'svelte/store'
import { components } from './breadboard'
import { grabbingCornerX, grabbingCornerY } from './visual'

const mostDistantSquareWidth = 500
const mostDistantSquareHeight = 300

const mostDistantCornerX: Readable<number> = derived(components, ($components) => {
    return $components.length > 0 ? Math.max.apply(Math, $components.map(c => c.cornerX)) : 0
}, 0)
const mostDistantCornerY: Readable<number> = derived(components, ($components) => {
    return $components.length > 0 ? Math.max.apply(Math, $components.map(c => c.cornerY)) : 0
}, 0)

const canvasComputedWidth: Readable<number> = derived([mostDistantCornerX, grabbingCornerX], ([$mostDistantCornerX, $grabbingCornerX]) => {
    return Math.max($mostDistantCornerX, $grabbingCornerX)
}, 0)
const canvasComputedHeight: Readable<number> = derived([mostDistantCornerY, grabbingCornerY], ([$mostDistantCornerY, $grabbingCornerY]) => {
    return Math.max($mostDistantCornerY, $grabbingCornerY)
}, 0)

export const canvasWidth: Writable<number> = writable(get(mostDistantCornerX) + mostDistantSquareWidth)
export const canvasHeight: Writable<number> = writable(get(mostDistantCornerX) + mostDistantSquareHeight)

// There two functions ARE _NOT_ THROTTLED
// There two functions start working while $canvasComputedWidth == 0 initially
// There two functions stop working as soon as $canvasComputedWidth > 0
let canvasInitiallySized = false
const initialCanvasWidth = canvasComputedWidth.subscribe(($canvasComputedWidth) => {
    if ($canvasComputedWidth > 0) {
        canvasWidth.set($canvasComputedWidth + mostDistantSquareWidth)
        canvasInitiallySized = true
        initialCanvasWidth()
    }
})
const initialCanvasHeight = canvasComputedHeight.subscribe(($canvasComputedHeight) => {
    if ($canvasComputedHeight > 0) {
        canvasHeight.set($canvasComputedHeight + mostDistantSquareHeight)
        canvasInitiallySized = true
        initialCanvasHeight()
    }
})

// There two functions ARE THROTTLED
// There two functions do not start working while $canvasComputedWidth == 0 initially
// There two functions start working as soon as $canvasComputedWidth > 0
canvasComputedWidth.subscribe(throttle(100, false, ($canvasComputedWidth: number) => {
    if (! canvasInitiallySized) return
    canvasWidth.set($canvasComputedWidth + mostDistantSquareWidth)
}) as Subscriber<number>)
canvasComputedHeight.subscribe(throttle(100, false, ($canvasComputedHeight: number) => {
    if (! canvasInitiallySized) return
    canvasHeight.set($canvasComputedHeight + mostDistantSquareHeight)
}) as Subscriber<number>)
