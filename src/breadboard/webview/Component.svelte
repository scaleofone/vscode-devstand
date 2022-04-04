<script>
    import { extension } from './transport'
    import { records } from './stores/breadboard'

    import ComponentDropdown from './ComponentDropdown.svelte'
    import ComponentSchemaDropdown from './ComponentSchemaDropdown.svelte'
    import RenameComponentForm from './RenameComponentForm.svelte'

    /** @type {import('../../BreadboardTypes').Component} */
    export let component

    $: componentWasReferenced = $records.some(r => r.referencedComponentIdentifier == component.identifier)

    let renameFormIsVisible = false
    function handleDeleteComponent() {
        console.log('handleDeleteComponent')
        extension.deleteComponent({
            identifier: component.identifier,
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

            <div class="flex items-center height-mono" style="background-color: var(--square-section-color);">
                <RenameComponentForm
                    component={component}
                    on:success={() => renameFormIsVisible = false}
                    on:cancel={() => renameFormIsVisible = false}
                />
            </div>

        {:else}

            <div class="flex items-center height-mono pl-half pr-quater" style="background-color: var(--square-section-color);">

                <div class="font-mono" class:square-color-foreground={componentWasReferenced} class:unreferenced-component-identifier={!componentWasReferenced} style="font-weight: bold;">{component.identifier}</div>

                <div class="grow height-mono cursor-grab" style="min-width: 1rem"
                    on:pointerdown={forwardPointerEventToSquareKnob}
                ></div>

                <div class="font-mono pr-quater cursor-grab" style="opacity: 0.5;"
                    on:pointerdown={forwardPointerEventToSquareKnob}
                >{component.templateImportVariableName}</div>

                <div class="shrink-0">
                    <ComponentSchemaDropdown
                        component={component}
                        on:delete={handleDeleteComponent}
                        on:rename={()=> renameFormIsVisible = true}
                    />
                </div>
            </div>

        {/if}
    </div>

    <slot></slot>

</div>
