import vscode from 'vscode'
import WizardWebview from './WizardWebview'

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('KitchenSink.wizardOpen', () => {
            WizardWebview.instantiateOrReveal(context.extensionUri, 'wizard')
        })
    )
    context.subscriptions.push(
        vscode.commands.registerCommand('KitchenSink.kickerOpen', () => {
            WizardWebview.instantiateOrReveal(context.extensionUri, 'kicker')
        })
    )
    context.subscriptions.push(
        vscode.commands.registerCommand('KitchenSink.truncateListing', () => {
            if (WizardWebview.instance) {
                WizardWebview.instance.truncateListing()
            } else {
                vscode.window.showErrorMessage('WizardWebview is not open')
            }
        })
    )
    context.subscriptions.push(
        vscode.commands.registerCommand('KitchenSink.resetListing', () => {
            if (WizardWebview.instance) {
                WizardWebview.instance.resetListing()
            } else {
                vscode.window.showErrorMessage('WizardWebview is not open')
            }
        })
    )
}

export function deactivate() {}
