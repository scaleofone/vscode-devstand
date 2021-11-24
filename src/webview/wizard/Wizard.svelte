<script>
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
        console.log('====== emitFiles ======')
        console.info('index.html')
        console.log(htmlContent)
        if (cssContent.trim()) {
            console.info('style.css')
            console.log(cssContent)
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
