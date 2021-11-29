import domainApi from './WizardDomainApi.js'
import './WebviewFacade.js'

import Wizard from './Wizard.svelte'

const app = new Wizard({
    target: document.body,
    context: new Map([
        ['domainApi', domainApi],
    ]),
    // props: { }
})

export default app
