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


    let listing = ''

    const requestListing = (directory) => {
        vscodeApi.postMessage({ command: 'requestListing', directory })
    }
    const requestFindFiles = (pattern) => {
        vscodeApi.postMessage({ command: 'requestFindFiles', pattern })
    }

    window.addEventListener('message', (event) => {
        const message = event.data
        switch (message.command) {
            case 'resolveListing':
                listing = message.listing.join("\n")
                break
            case 'resolveFindFiles':
                listing = message.files.sort().join("\n")
                break
        }
    })

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

    <br>
    <br>

    Listing
    <pre
        style="min-height:10em"
        class="snippet-textarea"
    >{listing}</pre>

    <br>

    <button on:click="{()=>requestListing('/')}" class="w-auto">Request listing /</button>
    <button on:click="{()=>requestListing('/vendor')}" class="w-auto">Request listing /vendor</button>
    <button on:click="{()=>requestFindFiles({ pattern: '**/composer.json', exclude: '**​/node_modules/**' })}" class="w-auto">Find all composer.json files</button>
    <button on:click="{()=>requestFindFiles({ pattern: '**/.gitignore', exclude: '{**​/node_modules/**,vendor/**}' })}" class="w-auto">Find all .gitignore files</button>

</div>
