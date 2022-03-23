import { tick } from 'svelte'
import { Writable, writable, get } from 'svelte/store'
import { Component } from '../../../BreadboardTypes'
import { EditorSettings, NewComponentGeometry } from '../../../TransportPayloads'
import { components, records } from './breadboard'
import { colorHexForIndex, availableColorIndexes } from './visual'
import { editorSettings } from './misc'

export interface SquareDimension {
    componentIdentifier: string
    width: number
    height: number
    cornerY: number
    cornerX: number
    colorHex: string
}

export const squareDimensions: Writable<SquareDimension[]> = writable([])

function crawlSquareDimensions($components: Component[]): SquareDimension[] {
    let result: SquareDimension[] = []
    for (let squareElement of document.querySelectorAll('.square') as NodeListOf<HTMLDivElement>) {
        const component = $components.find(c => c.identifier == squareElement.dataset.componentIdentifier)
        result.push({
            componentIdentifier: squareElement.dataset.componentIdentifier,
            height: squareElement.offsetHeight,
            width: squareElement.offsetWidth,
            cornerY: component.cornerY,
            cornerX: component.cornerX,
            colorHex: colorHexForIndex(component.colorIndex),
        })
    }
    return result
}


export interface BrickClamp {
    componentIdentifier: string
    referencedComponentIdentifier: string
    recordPath: string
    offsetY: number
}

export const brickClamps: Writable<BrickClamp[]> = writable([])

function crawlBrickClamps(): BrickClamp[] {
    let result: BrickClamp[] = []
    for (let clampElement of document.querySelectorAll('[data-clamp="brick"]') as NodeListOf<HTMLDivElement>) {
        const brickClamp: BrickClamp = {
            componentIdentifier: clampElement.dataset.componentIdentifier,
            referencedComponentIdentifier: clampElement.dataset.referencedComponentIdentifier,
            recordPath: clampElement.dataset.recordPath,
            offsetY: clampElement.offsetTop,
        }
        // do not add clamp if any similar clamp has already been added
        let shouldBeAdded = -1 == result.findIndex(bc => (
            bc.componentIdentifier == brickClamp.componentIdentifier
            && bc.referencedComponentIdentifier == brickClamp.referencedComponentIdentifier
        ))
        if (shouldBeAdded) {
            result.push(brickClamp)
        }
    }
    return result
}

export interface BrickCoordinate {
    componentIdentifier: string
    recordPath: string
    topLeftY: number
    topLeftX: number
    bottomRightY: number
    bottomRightX: number
}

export const brickCoordinates: Writable<BrickCoordinate[]> = writable([])

function crawlBrickCoordinates($squareDimensions: SquareDimension[]): BrickCoordinate[] {
    let result = []
    for (let brickElement of document.querySelectorAll('[data-role="brick"]') as NodeListOf<HTMLDivElement>) {
        let sd = $squareDimensions.find(sd => sd.componentIdentifier == brickElement.dataset.componentIdentifier)
        result.push({
            componentIdentifier: brickElement.dataset.componentIdentifier,
            recordPath: brickElement.dataset.recordPath,
            topLeftY: brickElement.offsetTop + sd.cornerY,
            topLeftX: brickElement.offsetLeft + sd.cornerX,
            bottomRightY: brickElement.offsetTop + sd.cornerY + brickElement.offsetHeight,
            bottomRightX: brickElement.offsetLeft + sd.cornerX + brickElement.offsetWidth,
        })
    }
    return result
}

export function findBrickCoordinatesBelowPointer($pointer: { X: number, Y: number }, $zoom: number, surfaceScrollTop: number, surfaceScrollLeft: number): BrickCoordinate | undefined {
    $pointer.Y = $pointer.Y - 0.5 * get(editorSettings).lineHeight * $zoom
    return get(brickCoordinates).find(bc => (
        bc.topLeftY <= ($pointer.Y /$zoom + surfaceScrollTop/$zoom) && ($pointer.Y /$zoom + surfaceScrollTop/$zoom) <= bc.bottomRightY
        && bc.topLeftX < ($pointer.X /$zoom + surfaceScrollLeft/$zoom) && ($pointer.X /$zoom + surfaceScrollLeft/$zoom) < bc.bottomRightX
    ))
}

export function crawl() {
    console.log('crawl')
    squareDimensions.set(
        crawlSquareDimensions(get(components))
    )
    brickClamps.set(
        crawlBrickClamps()
    )
    arrows.set(
        recalculateArrows(
            get(squareDimensions),
            get(brickClamps),
            get(editorSettings)
        )
    )
    brickCoordinates.set(
        crawlBrickCoordinates(get(squareDimensions))
    )
}

records.subscribe(async ($records) => {
    await tick()
    if ($records.filter(r => ! r.persisted).length > 0) {
        brickCoordinates.set(
            crawlBrickCoordinates(get(squareDimensions))
        )
    }
})

components.subscribe(async () => {
    await tick()
    crawl()
})
editorSettings.subscribe(async () => {
    await tick()
    crawl()
})


export interface Arrow {
    fromComponentIdentifier: string
    fromComponentCornerY: number
    fromComponentCornerX: number
    fromOffsetY: number
    fromOffsetXRight: number
    toComponentIdentifier: string
    toComponentCornerY: number
    toComponentCornerX: number
    toOffsetY: number
    toOffsetXRight: number
    color: string
}

export const arrows: Writable<Arrow[]> = writable([])

function recalculateArrows($squareDimensions: SquareDimension[], $brickClamps: BrickClamp[], $editorSettings: EditorSettings ): Arrow[] {
    const squareHeaderClampOffsetY = 0.5 * $editorSettings.lineHeight
    let result: Arrow[] = []
    for (let brickClamp of $brickClamps) {
        const squareDimension = $squareDimensions.find(sd => sd.componentIdentifier == brickClamp.componentIdentifier)
        const referencedSquareDimension = $squareDimensions.find(sd => sd.componentIdentifier == brickClamp.referencedComponentIdentifier)

        let arrow: Arrow = {
            fromComponentIdentifier: squareDimension.componentIdentifier,
            fromComponentCornerY: squareDimension.cornerY,
            fromComponentCornerX: squareDimension.cornerX,

            fromOffsetY: brickClamp.offsetY + 2,
            fromOffsetXRight: squareDimension.width,

            toComponentIdentifier: referencedSquareDimension.componentIdentifier,
            toComponentCornerY: referencedSquareDimension.cornerY,
            toComponentCornerX: referencedSquareDimension.cornerX,

            toOffsetY: squareHeaderClampOffsetY + 2,
            toOffsetXRight: referencedSquareDimension.width,

            color: referencedSquareDimension.colorHex,
        }
        result.push(arrow)
    }
    return result
}


export function guessGeometryForNewComponent(): NewComponentGeometry {
    let colorIndex = get(availableColorIndexes)[0]
    let cornerY = 50
    let cornerX = 200
    return { colorIndex, cornerY, cornerX }
}
