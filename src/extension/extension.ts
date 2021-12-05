import vscode from 'vscode'
import KickerPanel from './kicker/KickerPanel'
import WizardPanel from './wizard/WizardPanel'

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('KitchenSink.wizardOpen', () => {
            WizardPanel.instance(context.extensionUri).reveal()
        })
    )
    context.subscriptions.push(
        vscode.commands.registerCommand('KitchenSink.kickerOpen', () => {
            KickerPanel.instance(context.extensionUri).reveal()
        })
    )
    context.subscriptions.push(
        vscode.commands.registerCommand('KitchenSink.truncateListing', () => {
            KickerPanel.instance(context.extensionUri).reveal().commandTruncateListing()
        })
    )
    context.subscriptions.push(
        vscode.commands.registerCommand('KitchenSink.resetListing', () => {
            KickerPanel.instance(context.extensionUri).reveal().commandResetListing()
        })
    )
}

export function deactivate() {}
