<script>
    import { handleReferenceGrabStartEvent, dragoverRecordPath } from './stores/visual'

    /** @type {import('../../BreadboardTypes').Record} */
    export let record

</script>

<div class="flex items-center show-record-knob-on-hover"
    class:brick--dragover={$dragoverRecordPath == record.path}
    data-role="brick"
    data-record-path={record.path}
    data-component-identifier={record.componentIdentifier}
    >

    <div class="shrink cursor-grab height-mono record-knob"
        on:pointerdown={(event) => {
            handleReferenceGrabStartEvent(event, record)
        }}
    ></div>

    <div class="grow" style="background-color: var(--vscode-editor-background);">
        <slot></slot>
    </div>

    {#if record.referencedComponentIdentifier}
        <div class="shrink" style="width:0px; height:0px; background:fuchsia"
            data-clamp="brick"
            data-record-path={record.path}
            data-component-identifier={record.componentIdentifier}
            data-referenced-component-identifier={record.referencedComponentIdentifier}
        ></div>
    {/if}

</div>
