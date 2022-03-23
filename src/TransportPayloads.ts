import { VscodeRange } from './BreadboardTypes'

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

export interface OpenDocument {
    preserveFocus?: boolean
    preview?: boolean
    selection?: VscodeRange
    viewColumn?: 'Active' | 'Beside'
}

export interface CreateRecordValue {
    componentIdentifier: string
    recordScope: string
    recordIdentifier: string
    recordValue: string | number | null
    recordType: 'string' | 'number' | 'null' | 'object'
    belowRecordIdentifier?: string
}

export interface CreateScopeWithRecords {
    componentIdentifier: string
    scopeIdentifier: string
    records: Array<{
        identifier: string
        value: string | number
        type: 'string' | 'number' | 'reference' | 'concatenation'
    }>
}

export interface DeleteRecord {
    componentIdentifier: string
    recordIdentifier: string
    recordScope: string
}

export interface RenameRecord {
    componentIdentifier: string
    recordIdentifier: string
    recordScope: string
    renameRecordIdentifier: string
}

export interface MutateComponentGeometry {
    componentIdentifier: string
    cornerY: number
    cornerX: number
    colorIndex: number
}

export interface ModifyRecord {
    componentIdentifier: string
    recordIdentifier: string
    recordScope: string
    renameRecordIdentifier: string
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
    halfFontSize?: number,
    quaterFontSize?: number,
}

export interface NewComponentGeometry {
    colorIndex: number
    cornerY: number
    cornerX: number
}
