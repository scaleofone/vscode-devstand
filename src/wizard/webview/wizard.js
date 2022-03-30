import '../../lib/vscode.css';
import '../../lib/input-check.css';
import './wizard.css';

import './transport'
import Distro from './Distro.svelte'

const app = new Distro({
    target: document.body,
    // props: { }
})

export default app
