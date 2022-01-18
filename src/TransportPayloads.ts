export interface RenameComponent {
    before: string,
    after: string,
}

export interface RemoveComponent {
    identifier: string
}

export interface RemoveRecord {
    componentIdentifier: string
    recordIdentifier: string
}

export interface RenameRecord {
    componentIdentifier: string
    recordIdentifier: string
    renameRecordIdentifier: string
}

export interface AddTemplateImport {
    variableName: string
    targetFile: string
    targetIdentifier: string
}

export interface RemoveTemplateImport {
    variableName: string
}
