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
        let { component, records, meta } = convertToComponent(objectField)
        if (component) {
            breadboard.components.push(component)
            for (let record of records) {
                breadboard.records.push(record)
            }
        }
        if (meta) {
            breadboard.meta = meta
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

function convertToComponent(node: ast.ObjectField): { component: Component | undefined, records: Record[], meta: object | undefined } {
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
            meta: undefined,
            component: {
                identifier: node.id.name,
                templateImportVariableName: node.expr2.left.id.name,
                vscodeRange,
            },
            records: node.expr2.right.fields.toArray().map(convertToRecord(node.id.name, '')).flat(1) as Record[]
        }
    } else {
        let meta = undefined
        if (node.id.name == 'meta' && ast.isLiteralString(node.expr2)) {
            try {
                meta = JSON.parse(node.expr2.value)
            } catch { /* do nothing */ }
        }
        return {
            meta,
            component: undefined,
            records: [],
        }
    }
}

function convertToRecord(componentIdentifier: string, scope: string) { return (node: ast.ObjectField): Record[] => {
    const vscodeRange: VscodeRange = {
        startLine: node.loc.begin.line - 1,
        startCharacter: node.loc.begin.column - 1,
        endLine: node.loc.end.line - 1,
        endCharacter: node.loc.end.column - 1,
    }
    const identifier = node.id.name
    const path = `$.${componentIdentifier}.${scope ? scope+'.' : ''}${identifier}`

    const shortScope = ((scopeItems) => {
        if (scopeItems.length > 1) {
            scopeItems.shift()
            return scopeItems.join('.')
        } else {
            return ''
        }
    })(scope.split('.'))

    if (ast.isLiteralNull(node.expr2)) {
        return [{
            inSchema: undefined,
            identifier,
            path,
            value: null,
            type: 'null',
            componentIdentifier,
            scope,
            shortScope,
            vscodeRange,
        }]
    }
    if (ast.isLiteralString(node.expr2)) {
        return [{
            inSchema: undefined,
            identifier,
            path,
            value: node.expr2.value,
            type: 'string',
            componentIdentifier,
            scope,
            shortScope,
            vscodeRange,
        }]
    }
    if (ast.isLiteralNumber(node.expr2)) {
        return [{
            inSchema: undefined,
            identifier,
            path,
            value: node.expr2.value,
            type: 'number',
            componentIdentifier,
            scope,
            shortScope,
            vscodeRange,
        }]
    }
    if (ast.isObjectNode(node.expr2)) {
        return [
            {
                inSchema: undefined,
                identifier,
                path,
                value: '{...}',
                type: 'object',
                componentIdentifier,
                scope,
                shortScope,
                vscodeRange,
            },
            ...node.expr2.fields.toArray().map(convertToRecord(componentIdentifier, (scope ? scope+'.' : '')+node.id.name)).flat(1)
        ]
    }
    if (ast.isIndex(node.expr2)) {
        const reference = convertToReference(node.expr2).reverse()
        if (reference.length == 3 && reference[0] == '$') {
            const referencedComponentIdentifier = reference[1]
            const referencedRecordIdentifier = reference[2]
            return [{
                inSchema: undefined,
                identifier,
                path,
                value: reference.join('.'),
                type: 'reference',
                referencedComponentIdentifier,
                referencedRecordIdentifier,
                componentIdentifier,
                scope,
                shortScope,
                vscodeRange,
            }]
        }
    }
    if (
        (ast.isApplyBrace(node.expr2) || (ast.isBinary(node.expr2) && node.expr2.op == 'BopPlus'))
        && ast.isIndex(node.expr2.left)
        && ast.isObjectNode(node.expr2.right)
    ) {
        const reference = convertToReference(node.expr2.left).reverse()
        if (reference.length == 3 && reference[0] == '$') {
            const referencedComponentIdentifier = reference[1]
            const referencedRecordIdentifier = reference[2]
            return [
                {
                    inSchema: undefined,
                    identifier,
                    path,
                    value: reference.join('.'),
                    type: 'composition',
                    referencedComponentIdentifier,
                    referencedRecordIdentifier,
                    componentIdentifier,
                    scope,
                    shortScope,
                    vscodeRange,
                },
                ...node.expr2.right.fields.toArray().map(convertToRecord(componentIdentifier, node.id.name)).flat(1) as Record[]
            ]
        }
    }
    if (ast.isBinary(node.expr2) && node.expr2.op == 'BopPlus') {
        let concatenation = []
        try {
            concatenation = convertToConcatenation(node.expr2)
        } catch (err) {
            console.error(err)
        }
        const reference = concatenation.find(ref => Array.isArray(ref) && ref.length == 3 && ref[0] == '$')
        if (reference && concatenation.length > 1) {
            const stringifiedConcatenation = concatenation.map(item => Array.isArray(item) ? item.join('.') : item)
            const referencedComponentIdentifier = reference[1]
            const referencedRecordIdentifier = reference[2]
            return [{
                inSchema: undefined,
                identifier,
                path,
                value: stringifiedConcatenation.join(' + '),
                concatenationItems: concatenation,
                type: 'concatenation',
                referencedComponentIdentifier,
                referencedRecordIdentifier,
                componentIdentifier,
                scope,
                shortScope,
                vscodeRange,
            }]
        }
    }
    return [{
        inSchema: undefined,
        identifier,
        path,
        value: '?',
        type: 'unsupported',
        componentIdentifier,
        scope,
        shortScope,
        vscodeRange,
    }]
}}

function convertToReference(node: ast.Index): string[] {
    let result = [node.id.name]
    if (ast.isIndex(node.target)) {
        result = [...result, ...convertToReference(node.target).flat(1)]
    }
    if (ast.isDollar(node.target)) {
        result = [...result, '$']
    }
    return result
}

function convertToConcatenation(node: ast.Binary): Array<string | string[]> {
    let result = []
    if (ast.isIndex(node.right)) {
        result = [...result, convertToReference(node.right).reverse()]
    } else if (ast.isLiteralString(node.right)) {
        result = [...result, node.right.value]
    } else {
        throw `Concatenation RIGHT unsupported with Node[type=${ node.right.type }]`
    }

    if (ast.isIndex(node.left)) {
        result = [convertToReference(node.left).reverse(), ...result]
    } else if (ast.isBinary(node.left)) {
        result = [...convertToConcatenation(node.left), ...result]
    } else if (ast.isLiteralString(node.left)) {
        result = [node.left.value, ...result]
    } else {
        throw `Concatenation LEFT unsupported with Node[type=${ node.right.type }]`
    }

    return result
}
