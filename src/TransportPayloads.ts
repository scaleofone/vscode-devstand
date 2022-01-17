export interface RenameComponent {
    before: string,
    after: string,
}

export interface AddTemplateImport {
    variableName: string
    targetFile: string
    targetIdentifier: string
}

export interface RemoveTemplateImport {
    variableName: string
}
