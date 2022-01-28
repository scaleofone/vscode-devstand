import vscode from 'vscode'
import { TemplateSchemaDictionaryItem } from './jsonnet/BreadboardTypes'

export default async function(): Promise<TemplateSchemaDictionaryItem[]> {

    if (! Array.isArray(vscode.workspace.workspaceFolders) || vscode.workspace.workspaceFolders.length == 0) {
        return Promise.resolve([])
    }
    const workspaceFolder: vscode.WorkspaceFolder = vscode.workspace.workspaceFolders[0]

    const foundFiles: vscode.Uri[] = []
    for (let uri of [
        vscode.Uri.joinPath(workspaceFolder.uri, '.devstand', 'jsonnetpkg'),
        vscode.Uri.joinPath(workspaceFolder.uri, 'jsonnetpkg'),
    ]) {
        foundFiles.push(...await vscode.workspace.findFiles(new vscode.RelativePattern(uri, '**/breadboard-meta.json'), null, 100))
    }

    const result: TemplateSchemaDictionaryItem[] = []
    for (let foundFileUri of foundFiles) {
        try {
            const breadboardMetaJson = JSON.parse((await vscode.workspace.fs.readFile(foundFileUri)).toString())
            for (let templateJson of Object.values(breadboardMetaJson.templates) as any[]) {
                if (
                    typeof templateJson == 'object' && templateJson
                    && 'file' in templateJson && typeof templateJson.file == 'string'
                    && 'template' in templateJson && typeof templateJson.template == 'string'
                    && 'schema' in templateJson && isValidJsonSchema(templateJson.schema)
                ) {
                    result.push({
                        targetFile: foundFileUri.path.replace(/breadboard-meta\.json$/, templateJson.file),
                        targetIdentifier: templateJson.template,
                        schema: templateJson.schema,
                    })
                }
            }
        } catch (error) {
            continue // just skip this file
        }
    }
    return result
}

function isValidJsonSchema(o: any): boolean {
    if (! (
        typeof o == 'object' && o
        && 'title' in o && typeof o.title == 'string'
        && 'properties' in o && typeof o.properties == 'object'
    )) {
        return false
    }
    if ('description' in o && typeof o.description != 'string') { return false }
    if ('required' in o && ! Array.isArray(o.required)) { return false }
    return true
}
