export interface RenameComponent {
    before: string,
    after: string,
}

export interface DeleteComponent {
    identifier: string
}

export interface DeleteRecord {
    componentIdentifier: string
    recordIdentifier: string
}

export interface RenameRecord {
    componentIdentifier: string
    recordIdentifier: string
    renameRecordIdentifier: string
}

export interface CreateTemplateImport {
    variableName: string
    targetFile: string
    targetIdentifier: string
}

export interface DeleteTemplateImport {
    variableName: string
}
