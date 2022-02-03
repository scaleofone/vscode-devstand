import '../vscode.css'
import './controls/Menu.css'
import './controls/Dropdown.css'
import './Component.css'
import './Record.css'
import './breadboard.css'

import './transport'
import Breadboard from './Breadboard.svelte'

const app = new Breadboard({
    target: document.body,
    // props: { }
})

export default app
