export interface RenameComponent {
    before: string,
    after: string,
}

export interface AddTemplateImport {
    variableName: string
    targetFile: string
    targetIdentifier: string
}
