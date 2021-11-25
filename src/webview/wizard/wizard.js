import { vscodeApiFactory } from '../vscode.js'
const vscodeApi = vscodeApiFactory()

import Wizard from './Wizard.svelte'

const app = new Wizard({
    target: document.body,
    context: new Map([
        ['vscodeApi', vscodeApi]
    ]),
    // props: { }
})

export default app
