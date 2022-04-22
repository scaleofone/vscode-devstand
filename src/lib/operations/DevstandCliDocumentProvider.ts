import vscode from 'vscode'
import invokeDevstandCli from './invokeDevstandCli'

export const scheme = 'devstand-cli'

export class DevstandCliDocumentProvider implements vscode.TextDocumentContentProvider {

    provideTextDocumentContent(uri: vscode.Uri): string {
        let operation: string
        let documentPath: string
        if (uri.path.substr(0, 9) == 'manifests') {
            operation = 'manifests'
            documentPath = uri.path.substr(10).trim().replace(/\.jsonnet\.yaml$/, '.jsonnet')
            // return JSON.stringify({ operation, documentPath })
            return invokeDevstandCli(operation, documentPath)
        } else {
            return 'Unknown_command for path '+uri.path
        }
    }

    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>()
    onDidChange = this.onDidChangeEmitter.event
}
