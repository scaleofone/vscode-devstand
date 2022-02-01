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

export interface Record {
    type: 'string' | 'number' | 'object' | 'reference' | 'unknown', // 'null' | 'boolean' | 'array' |
    componentIdentifier: string,
    identifier: string,
    value: string | number,
}

export interface Component {
    identifier: string,
    templateImportVariableName: string,
}

export interface Breadboard {
    templateImports: TemplateImport[],
    schemaDictionary: TemplateSchemaDictionaryItem[],
    components: Component[],
    records: Record[],
}
