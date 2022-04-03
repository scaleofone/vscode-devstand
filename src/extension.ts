import vscode from 'vscode'
import WizardPanel from './wizard/extension/WizardPanel'
import BreadboardEditorProvider from './breadboard/extension/BreadboardEditorProvider'
import scaffoldBreadboardFolder from './lib/operations/scaffoldBreadboardFolder'

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('DevStand.wizardOpen', () => {
            WizardPanel.instance(context.extensionUri).reveal()
        })
    )
    context.subscriptions.push(
        vscode.commands.registerCommand('DevStand.openWizardFromFolder', (folderFromContextMenu: vscode.Uri) => {
            WizardPanel.instance(context.extensionUri).reveal().setOpenedFromFolder(folderFromContextMenu)
        })
    )
    context.subscriptions.push(
        vscode.commands.registerCommand('DevStand.scaffoldBreadboardFolder', async (folderFromContextMenu: vscode.Uri) => {
            const breadbordFileTopOpen = await scaffoldBreadboardFolder(folderFromContextMenu)
            if (breadbordFileTopOpen) {
                vscode.commands.executeCommand('DevStand.openWithBreadboardEditor', breadbordFileTopOpen)
            }
        })
    )
    context.subscriptions.push(
        vscode.commands.registerCommand('DevStand.openWithBreadboardEditor', (fileFromContextMenu: vscode.Uri) => {
            vscode.commands.executeCommand('vscode.openWith', fileFromContextMenu, BreadboardEditorProvider.viewType)
        })
    )
    context.subscriptions.push(
        vscode.window.registerCustomEditorProvider(BreadboardEditorProvider.viewType, BreadboardEditorProvider.instance(context.extensionUri))
    )
}

export function deactivate() {}
