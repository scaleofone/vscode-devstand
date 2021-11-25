import { vscodeApiFactory } from '../vscode.js'
const vscodeApi = vscodeApiFactory()

import Editor from './Editor.svelte'

const app = new Editor({
    target: document.body,
    context: new Map([
        ['vscodeApi', vscodeApi]
    ]),
    // props: { }
})

export default app
