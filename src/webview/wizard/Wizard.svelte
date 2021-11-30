<script>
    import { getContext } from 'svelte'

    /** @typedef { import('./WizardDomainApi.js').WizardDomainApi } WizardDomainApi */
    /** @type WizardDomainApi */
    const domainApi = getContext('domainApi')

    let htmlContent = "<html>\n  hello world\n</html>";
    let cssContent = ".red {\n  color: red;\n}";

    const pasteCssLinkIfNecessary = () => {
        const cssLink = "\n  <link href=style.css rel=stylesheet>";
        if (cssContent.trim()) {
            if (htmlContent.indexOf(cssLink) == -1) {
                htmlContent = htmlContent.replace('<html>', "<html>"+cssLink)
            }
        } else {
            htmlContent = htmlContent.replace(cssLink, '')
        }
    }
    const emitFiles = () => {
        domainApi.showMessage('index.html')
        if (cssContent.trim()) {
            domainApi.showMessage('style.css')
        }
    }

    const runWizard = () => {
        pasteCssLinkIfNecessary()
        emitFiles()
    }

</script>

<div>

    <div class="grid-snippets">
        <div>

            index.html
            <textarea
                bind:value={htmlContent}
                rows="5" spellcheck="false"
                class="snippet-textarea"
            ></textarea>

        </div>
        <div>

            style.css
            <textarea
                bind:value={cssContent}
                rows="5" spellcheck="false"
                class="snippet-textarea"
            ></textarea>

        </div>
    </div>

    <br>

    <button on:click={runWizard}>Run wizard</button>

</div>
