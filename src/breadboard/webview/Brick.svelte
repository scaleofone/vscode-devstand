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

<div class="flex items-center show-record-knob-on-hover show-record-addInsideScope-button-on-hover"
    class:brick--dragover={$dragoverRecordPath == record.path}
    class:brick--section={knobIsForSection}
    class:brick--having-editor={! knobIsVisible}
    data-role="brick"
    data-record-path={record.path}
    data-component-identifier={record.componentIdentifier}
    style={[
        knobIsForSection ? '--knob-color: var(--square-section-color)' : null,
    ].filter(n=>n).join(';')}
    >

    {#if false && ! record.persisted }
        <div class="shrink relative height-mono" style="width: 0;">
            <div class="absolute height-mono" style="right: 1rem; color: red; line-height: var(--height-mono);">!persisted</div>
        </div>
    {/if}


    <div class="shrink cursor-grab height-mono record-knob record-knob--alt"
        class:hidden={! knobIsVisible || ! record.persisted}
        on:pointerdown={(event) => {
            handleReferenceGrabStartEvent(event, record)
        }}
    ></div>

    <div class="grow"
        style="background-color: var(--knob-color);"
        >

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
