import '../vscode.css';
import './kicker.css';

import './transport'
import Kicker from './Kicker.svelte'

const app = new Kicker({
    target: document.body,
    // props: { }
})

export default app
