<script>
    import { setContext } from 'svelte'
    import { handleReferenceGrabStartEvent, dragoverRecordPath } from './stores/visual'

    /** @type {import('../../BreadboardTypes').Record} */
    export let record

    let knobIsVisible = true
    let knobIsForSection = false
    setContext('brick', {
        setKnobVisible: (isVisible) => knobIsVisible = isVisible,
        setKnobIsForSection: (isForSection) => knobIsForSection = isForSection,
    })

</script>

<div class="flex items-center show-record-knob-on-hover"
    class:brick--dragover={$dragoverRecordPath == record.path}
    class:brick--section={knobIsForSection}
    data-role="brick"
    data-record-path={record.path}
    data-component-identifier={record.componentIdentifier}
    >

    <div class="shrink cursor-grab height-mono record-knob"
        class:hidden={! knobIsVisible}
        class:record-knob--section={knobIsForSection}
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
