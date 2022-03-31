import '../../lib/vscode.css';
import '../../lib/webview.css'

import '../../lib/input-check.css';

import './distro.css';

import './transport'
import Distro from './Distro.svelte'

const app = new Distro({
    target: document.body,
    // props: { }
})

export default app
