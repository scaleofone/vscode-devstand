import vscode from 'vscode'
import findAvailableTemplates from './findAvailableTemplates'
import { TemplateImport, Component } from './jsonnet/BreadboardTypes'

export default async function(): Promise<{ templateImport:TemplateImport, component:Component }> {
    let templates = await findAvailableTemplates()
    let quickPickItems = templates.map((template, index) => {
        return {
            index,
            label: template.targetIdentifier,
            description: template.schema?.title,
            detail: template.schema?.description,
        }
    })
    let selectedQuickPickItem = await vscode.window.showQuickPick(quickPickItems, { title: 'Select template' })
    let templateImport = templates[selectedQuickPickItem.index]
    let selectedComponentName = await vscode.window.showInputBox({ title: 'Name of the square' })
    return {
        templateImport,
        component: {
            identifier: selectedComponentName,
            templateImportVariableName: templateImport.variableName,
            records: [],
        },
    }
}
