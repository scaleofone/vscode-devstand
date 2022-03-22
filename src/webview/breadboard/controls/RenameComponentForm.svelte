<script>
    import { onMount, createEventDispatcher, tick } from 'svelte'
    const dispatch = createEventDispatcher()

    import { components } from '../stores/breadboard'
    import { get } from 'svelte/store'

    import { extension } from '../transport'

    import { form, field } from 'svelte-forms'
    import { required } from 'svelte-forms/validators'

    /** @type {import('../../../BreadboardTypes').Component} */
    export let component

    /** @type HTMLInputElement */ let inputIdentifierElement
    /** @type HTMLDivElement */   let contentIdentifierElement

    let rejectedMessage

    const _componentIdentifier = field('componentIdentifier', component.identifier, [
        required(),
        (val) => ({
            name: 'unique',
            valid: (val == component.identifier || get(components).findIndex(c => c.identifier == val) == -1)
        }),
    ])
    const _form = form(_componentIdentifier)

    _form.subscribe(() => rejectedMessage = undefined) // called each time when form is changed

    function matchIdentifierWidth() {
        inputIdentifierElement.style.width = `${ contentIdentifierElement.offsetWidth + 1 }px`
    }
    _componentIdentifier.subscribe(async () => {
        await tick()
        matchIdentifierWidth()
    })

    function handleRenameComponent({ identifier }) {
        extension.renameComponent({
            before: component.identifier,
            after: identifier,
        }).then(() => {
            rejectedMessage = undefined
            dispatch('success', {...component, identifier })
        }).catch(err => {
            rejectedMessage = (err instanceof Error) ? (err.message || err.toString()) : err.toString()
        })
    }

    function captureEnterAndEscape(event) {
        if (event.keyCode == 13 /* Enter */) {
            if (! $_form.valid) { return }
            if ($_componentIdentifier.value == component.identifier) { return dispatch('cancel') }
            handleRenameComponent({
                identifier: $_componentIdentifier.value,
            })
        }
        if (event.keyCode == 27 /* Esc */) { dispatch('cancel') }
    }

    function focus() {
        inputIdentifierElement.focus()
        inputIdentifierElement.setSelectionRange(0, inputIdentifierElement.value.length)
    }

    onMount(() => focus())
</script>

<div class="relative" style="width: 100%;">
    <div class="flex">
        <input type="text"
            class="font-mono border-0 px-small"
            class:outline-color-invalid={(rejectedMessage || ! $_form.valid)}
            style="font-weight: bold; background-color: var(--square-section-color);"
            bind:this={inputIdentifierElement}
            bind:value={$_componentIdentifier.value}
            on:keydown={captureEnterAndEscape}
        >
    </div>

    {#if rejectedMessage || ! $_form.valid}
        <div
            class="absolute outline-invalid bg-invalid px-small py-for-small" style="z-index: 3; top: calc(var(--height-mono) - 1px);"
            >{rejectedMessage || $_form.errors[0]}</div>
    {/if}

    <div class="absolute" style="opacity: 0; z-index: -1">
        <div class="font-mono px-small min-max-width--contentIdentifierElement" style="font-weight: bold; float: left;"
            bind:this={contentIdentifierElement}
        >{$_componentIdentifier.value}</div>
    </div>

</div>
