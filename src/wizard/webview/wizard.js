import '../../lib/vscode.css';
import './wizard.css';

import './transport'
import Wizard from './Wizard.svelte'

const app = new Wizard({
    target: document.body,
    // props: { }
})

export default app
