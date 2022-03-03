<script>

    /** @type {import('../../BreadboardTypes').Record} */
    export let record

    $: recordPath = `$.${record.componentIdentifier}.${record.scope ? record.scope+'.' : ''}${record.identifier}`

</script>

<div class="flex items-center show-record-knob-on-hover">

    <div class="shrink" data-clamp="record-left"></div>

    <div class="shrink cursor-grab height-mono record-knob" title={recordPath}></div>

    <div class="grow" style="background-color: var(--vscode-editor-background);">
        <slot></slot>
    </div>

    <div class="shrink" data-clamp="record-right"></div>

</div>
