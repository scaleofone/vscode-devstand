import vscode from 'vscode'
import WizardWebview from './WizardWebview'

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('KitchenSink.wizardOpen', () => {
            WizardWebview.instantiateOrReveal(context.extensionUri)
        })
    );
}

export function deactivate() {}
