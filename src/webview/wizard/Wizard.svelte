<script>
    import { getContext } from 'svelte'
    const vscodeApi = getContext('vscodeApi')

    import '../vscode.css';
    import './wizard.css';
    
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
        vscodeApi.postMessage({ command: 'info', text: 'index.html'})
        if (cssContent.trim()) {
            vscodeApi.postMessage({ command: 'info', text: 'style.css'})
        }
    }

    const runWizard = () => {
        pasteCssLinkIfNecessary()
        emitFiles()
    }

</script>

<div>
    index.html
    <textarea
        bind:value={htmlContent}
        cols="30" rows="10" spellcheck="false"
        class="snippet-textarea"
    ></textarea>

    <br>

    style.css
    <textarea
        bind:value={cssContent}
        cols="30" rows="10" spellcheck="false"
        class="snippet-textarea"
    ></textarea>

    <br>

    <button on:click={runWizard}>Run wizard</button> 
</div>
