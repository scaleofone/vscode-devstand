<script>
    import { htmlContent, cssContent } from './stores/snippets.js'

    import { getContext } from 'svelte'

    /** @typedef { import('./WizardDomainApi.js').WizardDomainApi } WizardDomainApi */
    /** @type WizardDomainApi */
    const domainApi = getContext('domainApi')

    const runWizard = () => {
        domainApi.saveSnippets()
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
