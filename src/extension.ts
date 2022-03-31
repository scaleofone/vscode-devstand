import vscode from 'vscode'
import WizardPanel from './wizard/extension/WizardPanel'
import BreadboardEditorProvider from './breadboard/extension/BreadboardEditorProvider'

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('KitchenSink.wizardOpen', () => {
            WizardPanel.instance(context.extensionUri).reveal()
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
