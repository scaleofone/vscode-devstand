import vscode from 'vscode'
import KickerPanel from './kicker/KickerPanel'
import WizardPanel from './wizard/WizardPanel'

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('KitchenSink.wizardOpen', () => {
            WizardPanel.instantiateOrReveal(context.extensionUri)
        })
    )
    context.subscriptions.push(
        vscode.commands.registerCommand('KitchenSink.kickerOpen', () => {
            KickerPanel.instantiateOrReveal(context.extensionUri)
        })
    )
    context.subscriptions.push(
        vscode.commands.registerCommand('KitchenSink.truncateListing', () => {
            if (KickerPanel.instance) {
                KickerPanel.instance.commandTruncateListing()
            } else {
                vscode.window.showErrorMessage('KickerPanel is not open')
            }
        })
    )
    context.subscriptions.push(
        vscode.commands.registerCommand('KitchenSink.resetListing', () => {
            if (KickerPanel.instance) {
                KickerPanel.instance.commandResetListing()
            } else {
                vscode.window.showErrorMessage('KickerPanel is not open')
            }
        })
    )
}

export function deactivate() {}
