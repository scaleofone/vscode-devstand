import vscodeApi from '../vscode.js'

import Editor from './Editor.svelte'

const app = new Editor({
    target: document.body,
    context: new Map([
        ['vscodeApi', vscodeApi]
    ]),
    // props: { }
})

export default app
