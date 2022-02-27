export interface TemplateSchemaDictionaryItem {
    targetFile: string,
    targetIdentifier: string,
    schema: TemplateSchema,
}

export interface TemplateSchema {
    title: string,
    description?: string,
    properties: object,
    required?: string[],
}

export interface TemplateImport {
    variableName: string,
    targetFile: string,
    targetIdentifier: string,
}

export interface VscodeRange {
    startLine: number
    startCharacter: number
    endLine: number
    endCharacter: number
}

export interface Record {
    type: 'string' | 'number' | 'object' | 'reference' | 'composition' | 'null' | 'unsupported', // 'boolean' | 'array' |
    componentIdentifier: string,
    scope: string,
    identifier: string,
    value: string | number | null,
    inSchema: boolean | undefined,
    referencedComponentIdentifier?: string,
    referencedRecordIdentifier?: string,
    vscodeRange?: VscodeRange,
}

export interface Component {
    identifier: string,
    templateImportVariableName: string,
    vscodeRange?: VscodeRange,
}

export interface Breadboard {
    templateImports: TemplateImport[],
    schemaDictionary: TemplateSchemaDictionaryItem[],
    components: Component[],
    records: Record[],
}
