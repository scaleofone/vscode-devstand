import '../vscode.css';
import './wizard.css';

import { gateway } from './WizardWebviewContext'
import Wizard from './Wizard.svelte'

const app = new Wizard({
    target: document.body,
    context: new Map([
        ['gateway', gateway],
    ]),
    // props: { }
})

export default app
