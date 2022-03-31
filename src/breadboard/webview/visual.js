import '../../lib/vscode.css'

import './../../lib/Menu.css'
import './../../lib/Dropdown.css'
import './breadboard.css'

import './visual.css'
import './visual-map.css'

import './transport'
import Visual from './Visual.svelte'

const app = new Visual({
    target: document.body,
    // props: { }
})

export default app
