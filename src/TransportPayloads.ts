export interface CreateComponent {
    componentIdentifier: string
    templateImportVariableName: string
}

export interface RenameComponent {
    before: string,
    after: string,
}

export interface DeleteComponent {
    identifier: string
}

export interface CreateRecordValue {
    componentIdentifier: string
    recordIdentifier: string
    recordValue: string | number
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

export interface ModifyRecord {
    componentIdentifier: string
    recordIdentifier: string
    renameRecordIdentifier: string
    updateRecordValue: string | number
}

export interface UpdateRecordValue {
    componentIdentifier: string
    recordIdentifier: string
    updateRecordValue: string | number
}

export interface CreateTemplateImport {
    variableName: string
    targetFile: string
    targetIdentifier: string
}

export interface DeleteTemplateImport {
    variableName: string
}

export interface EditorSettings {
    fontSize: number
    lineHeight: number,
    lineHeightFraction: number,
}
