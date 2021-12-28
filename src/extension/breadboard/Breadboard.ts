export interface TemplateSchema {
    title: string,
    description: string,
    properties: object,
    required: string[],
}

export interface TemplateImport {
    name: string,
    localName: string,
    file: string,
    schema: TemplateSchema,
}

export interface ComponentRecord {
    name: string,
    value: string,
}

export interface Component {
    name: string,
    templateImportLocalName: string,
    records: ComponentRecord[],
}

export interface Breadboard {
    templateImports?: TemplateImport[],
    components?: Component[],
}

export function parseFromFile(text: string): Breadboard {
    return JSON.parse(text)
}

export function convertToFile(breadboard: Breadboard): string {
    return JSON.stringify(breadboard, null, 4)
}
