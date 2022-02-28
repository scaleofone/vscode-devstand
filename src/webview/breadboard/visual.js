import '../vscode.css'
import './breadboard.css'
import './visual.css'

import './transport'
import Visual from './Visual.svelte'

const app = new Visual({
    target: document.body,
    // props: { }
})

export default app
