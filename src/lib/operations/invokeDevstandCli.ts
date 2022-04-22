import vscode from 'vscode'
import execSync from '../shim/execSync'

export default function (operation: string, documentPath: string): string {
    try {
        return invokeCli(operation, documentPath)
    } catch (err) {
        vscode.window.showErrorMessage('Could not invoke devstand cli. ' + err)
    }
}

function invokeCli(operation: string, documentPath: string): string {
    let split = documentPath.split('/')
    let documentBasename = split.pop()
    let documentDirname = split.join('/')

    let output = execSync('devstand ' + operation + ' ' + documentBasename, { encoding: 'utf8', cwd: documentDirname }) as string

    return output
}
