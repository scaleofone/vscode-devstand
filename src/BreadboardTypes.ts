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
    componentIdentifier?: string,
    identifier: string,
    value: string | number,
}

export interface Component {
    identifier: string,
    templateImportVariableName: string,
    records: Record[],
}

export interface Breadboard {
    templateImports: TemplateImport[],
    components: Component[],
}
