import vscode from 'vscode'
import findAvailableTemplates from './findAvailableTemplates'
import { TemplateImport, Component } from '../BreadboardTypes'

export default async function(): Promise<{ templateImport:TemplateImport, component:Component }> {
    let templates = await findAvailableTemplates()
    let postgres1 = templates.shift()
    let postgres2 = templates.shift()
    postgres1.schema.title = 'PostgreSQL database'
    templates.push(postgres1)

    let quickPickItems = templates.map((template, index) => {
        return {
            index,
            label: template.schema.title,
            // label: template.targetIdentifier,
            // description: template.schema.title,
            // detail: template.schema?.description,
        }
    })
    let dummyTemplates = [
        'MySQL database',
        'Redis database',
        'S3 files storage',
        'SMTP relay',
    ]
    dummyTemplates.forEach((label, i) => quickPickItems.push({ label, index: i+templates.length }))

    let selectedQuickPickItem = await vscode.window.showQuickPick(quickPickItems, { title: 'Select template' })
    const selectedTemplate = templates[selectedQuickPickItem.index]
    let variableName = selectedTemplate.targetIdentifier.startsWith('Postgres') ? 'Postgres' : selectedTemplate.targetIdentifier
    let templateImport = {
        targetFile: selectedTemplate.targetFile,
        targetIdentifier: selectedTemplate.targetIdentifier,
        variableName,
    }
    let selectedComponentName = await vscode.window.showInputBox({ title: 'Name of the square' })
    // TODO validate componentIdentifier is already present
    // TODO validate componentIdentifier is not a reserved jsonnet keyword (eg: local/function)
    return {
        templateImport,
        component: {
            identifier: selectedComponentName,
            templateImportVariableName: templateImport.variableName,
        },
    }
}
