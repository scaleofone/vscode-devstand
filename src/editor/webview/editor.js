import '../../lib/vscode.css'
import './editor.css'

import './transport'
import Editor from './Editor.svelte'

const app = new Editor({
    target: document.body,
    // props: { }
})

export default app
