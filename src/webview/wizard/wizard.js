import { vscodeApiFactory } from '../vscode.js'
import WizardDomainApi from './WizardDomainApi.js'

const vscodeApi = vscodeApiFactory()
const domainApi = new WizardDomainApi(vscodeApi)

import Wizard from './Wizard.svelte'

const app = new Wizard({
    target: document.body,
    context: new Map([
        ['domainApi', domainApi]
    ]),
    // props: { }
})

export default app
