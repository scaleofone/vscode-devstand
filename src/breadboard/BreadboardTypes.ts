export interface TemplateSchemaDictionaryItem {
    possibleVariableName?: string,
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
    persisted?: boolean
    type: 'string' | 'number' | 'object' | 'reference' | 'composition' | 'concatenation' | 'null' | 'unsupported', // 'boolean' | 'array' |
    componentIdentifier: string,
    scope: string,
    shortScope: string,
    identifier: string,
    path: string,
    value: string | number | null,
    concatenationItems?: Array<string | string[]>,
    inSchema: boolean | undefined,
    referencedComponentIdentifier?: string,
    referencedRecordIdentifier?: string,
    vscodeRange?: VscodeRange,
}

export interface Component {
    identifier: string,
    templateImportVariableName: string,
    vscodeRange?: VscodeRange,
    cornerY: number
    cornerX: number
    colorIndex: number
}

export interface Breadboard {
    templateImports: TemplateImport[],
    schemaDictionary: TemplateSchemaDictionaryItem[],
    components: Component[],
    records: Record[],
    meta?: object | undefined,
}
