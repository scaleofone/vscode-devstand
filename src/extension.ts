import vscode from 'vscode'
import KickerPanel from './kicker/extension/KickerPanel'
import WizardPanel from './wizard/extension/WizardPanel'
import BreadboardEditorProvider from './breadboard/extension/BreadboardEditorProvider'

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

    context.subscriptions.push(
        vscode.commands.registerCommand('KitchenSink.openWithBreadboardEditor', (fileFromContextMenu: vscode.Uri) => {
            vscode.commands.executeCommand('vscode.openWith', fileFromContextMenu, BreadboardEditorProvider.viewType)
        })
    )
    context.subscriptions.push(
        vscode.window.registerCustomEditorProvider(BreadboardEditorProvider.viewType, BreadboardEditorProvider.instance(context.extensionUri))
    )
}

export function deactivate() {}
