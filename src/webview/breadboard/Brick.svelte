<script>
    import { handleReferenceGrabStartEvent } from './stores/visual'

    /** @type {import('../../BreadboardTypes').Record} */
    export let record

</script>

<div class="flex items-center show-record-knob-on-hover">

    <div class="shrink" data-clamp="record-left"></div>

    <div class="shrink cursor-grab height-mono record-knob"
        on:pointerdown={(event) => {
            handleReferenceGrabStartEvent(event, record)
        }}
    ></div>

    <div class="grow" style="background-color: var(--vscode-editor-background);">
        <slot></slot>
    </div>

    <div class="shrink" data-clamp="record-right"></div>

</div>
