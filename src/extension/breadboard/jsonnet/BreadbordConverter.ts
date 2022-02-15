import * as ast from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast'

import { Breadboard, TemplateImport, Component, Record, VscodeRange } from '../../../BreadboardTypes'

export function toBreadboard(localBindNodes: ast.LocalBind[], objectNode: ast.ObjectNode | undefined): Breadboard {
    let breadboard: Breadboard = {
        schemaDictionary: [],
        templateImports: [],
        components: [],
        records: [],
    }
    for (let localBindNode of localBindNodes) {
        let templateImport = convertToTemplateImport(localBindNode)
        if (templateImport) {
            breadboard.templateImports.push(templateImport)
        }
    }
    for (let objectField of (objectNode ? objectNode.fields.toArray() : [])) {
        let { component, records } = convertToComponent(objectField)
        if (component) {
            breadboard.components.push(component)
            for (let record of records) {
                breadboard.records.push(record)
            }
        }
    }
    return breadboard
}

function convertToTemplateImport(node: ast.LocalBind): TemplateImport | undefined {
    if (ast.isIndex(node.body) && ast.isImport(node.body.target)) {
        return {
            variableName: node.variable.name,
            targetFile: node.body.target.file,
            targetIdentifier: node.body.id.name,
        }
    }
}

function convertToComponent(node: ast.ObjectField): { component: Component | undefined, records: Record[] } {
    const vscodeRange: VscodeRange = {
        startLine: node.loc.begin.line - 1,
        startCharacter: node.loc.begin.column - 1,
        endLine: node.loc.end.line - 1,
        endCharacter: node.loc.end.column - 1,
    }
    if (
        node.expr2
        && (ast.isApplyBrace(node.expr2) || (ast.isBinary(node.expr2) && node.expr2.op == 'BopPlus'))
        && ast.isVar(node.expr2.left)
        && ast.isObjectNode(node.expr2.right)
    ) {
        return {
            component: {
                identifier: node.id.name,
                templateImportVariableName: node.expr2.left.id.name,
                vscodeRange,
            },
            records: node.expr2.right.fields.toArray().map(convertToRecord(node.id.name, undefined)).flat(1) as Record[]
        }
    } else {
        return {
            component: undefined,
            records: [],
        }
    }
}

function convertToRecord(componentIdentifier: string, scope: string | undefined) { return (node: ast.ObjectField): Record[] => {
    const vscodeRange: VscodeRange = {
        startLine: node.loc.begin.line - 1,
        startCharacter: node.loc.begin.column - 1,
        endLine: node.loc.end.line - 1,
        endCharacter: node.loc.end.column - 1,
    }
    if (ast.isLiteralString(node.expr2)) {
        return [{
            inSchema: undefined,
            identifier: node.id.name,
            value: node.expr2.value,
            type: 'string',
            componentIdentifier,
            scope,
            vscodeRange,
        }]
    }
    if (ast.isLiteralNumber(node.expr2)) {
        return [{
            inSchema: undefined,
            identifier: node.id.name,
            value: node.expr2.value,
            type: 'number',
            componentIdentifier,
            scope,
            vscodeRange,
        }]
    }
    if (ast.isObjectNode(node.expr2)) {
        return [
            {
                inSchema: undefined,
                identifier: node.id.name,
                value: '{...}',
                type: 'object',
                componentIdentifier,
                scope,
                vscodeRange,
            },
            ...node.expr2.fields.toArray().map(convertToRecord(componentIdentifier, (scope ? scope+'.' : '')+node.id.name)).flat(1)
        ]
    }
    if (ast.isIndex(node.expr2)) {
        return [{
            inSchema: undefined,
            identifier: node.id.name,
            value: '$...',
            type: 'reference',
            componentIdentifier,
            scope,
            vscodeRange,
        }]
    }
    return [{
        inSchema: undefined,
        identifier: node.id.name,
        value: '?',
        type: 'unknown',
        componentIdentifier,
        scope,
        vscodeRange,
    }]
}}
