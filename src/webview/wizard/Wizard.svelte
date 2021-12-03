<script>
    import { htmlContent, cssContent } from './stores/snippets.js'

    import { WizardExtensionGateway } from './WizardExtensionGateway'
    import { getContext } from 'svelte'
    /** @type WizardExtensionGateway */
    const gateway = getContext('gateway')

    const runWizard = () => {
        gateway.saveSnippets()
    }

</script>

<div>

    <div class="grid-snippets">
        <div>

            index.html
            <textarea
                bind:value={$htmlContent}
                rows="5" spellcheck="false"
                class="snippet-textarea"
            ></textarea>

        </div>
        <div>

            style.css
            <textarea
                bind:value={$cssContent}
                rows="5" spellcheck="false"
                class="snippet-textarea"
            ></textarea>

        </div>
    </div>

    <br>

    <button on:click={runWizard}>Run wizard</button>

</div>
