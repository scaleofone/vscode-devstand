<script>
    import { extension } from './transport'
    import { records } from './stores/breadboard'

    import ComponentDropdown from './ComponentDropdown.svelte'
    import ComponentSchemaDropdown from './ComponentSchemaDropdown.svelte'
    import RenameComponentForm from './controls/RenameComponentForm.svelte'

    /** @type {import('../../BreadboardTypes').Component} */
    export let component

    $: componentWasReferenced = $records.some(r => r.referencedComponentIdentifier == component.identifier)

    let renameFormIsVisible = false
    function handleRenameComponent(updIdentifier) {
        console.log('handleRenameComponent')
        extension.renameComponent({
            before: component.identifier,
            after: updIdentifier,
        })
        renameFormIsVisible = false
    }
    function handleDeleteComponent() {
        console.log('handleDeleteComponent')
        extension.deleteComponent({
            identifier: component.identifier,
        })
    }
    function handleAddRecord(record) {
        extension.createRecordValue({
            componentIdentifier: record.componentIdentifier,
            recordIdentifier: record.identifier,
            recordValue: record.value,
            recordType: record.type,
        })
    }
    // REFACTOR call function from getContext()
    function forwardPointerEventToSquareKnob(event) {
        const squareKnob = event.target.closest('.square')?.querySelector('[data-purpose="squareKnob"]')
        if (squareKnob) {
            let fwdEvent = new PointerEvent(event.type, event)
            squareKnob.dispatchEvent(fwdEvent)
        }
    }

</script>

<div class="inline-flex flex-col">

    <div class="role-brick role-component-header">
        {#if renameFormIsVisible}

            <div class="flex items-center height-mono">
                <RenameComponentForm
                    component={component}
                    on:success={(event) => handleRenameComponent(event.detail.identifier)}
                    on:cancel={() => renameFormIsVisible = false}
                />
            </div>

        {:else}

            <div class="flex items-center height-mono px-small" style="background-color: var(--square-section-color);">

                <div class="font-mono" class:square-color-foreground={componentWasReferenced} style="font-weight: bold;">{component.identifier}</div>

                <div class="grow height-mono cursor-grab" style="min-width: 1rem"
                    on:pointerdown={forwardPointerEventToSquareKnob}
                ></div>

                <div class="font-mono" style="opacity: 0.5;">{component.templateImportVariableName}</div>

                <div class="shrink-0">
                    <ComponentDropdown
                        component={component}
                        on:delete={handleDeleteComponent}
                        on:rename={()=> renameFormIsVisible = true}
                    />
                </div>
                <div class="shrink-0">
                    <ComponentSchemaDropdown
                        component={component}
                        on:addRecord={(event) => handleAddRecord(event.detail)}
                    />
                </div>
            </div>

        {/if}
    </div>

    <slot></slot>

</div>
