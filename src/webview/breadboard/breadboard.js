import '../vscode.css'
import './breadboard.css'

import './transport'
import Breadboard from './Breadboard.svelte'

const app = new Breadboard({
    target: document.body,
    // props: { }
})

export default app
