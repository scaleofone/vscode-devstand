import * as ast from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast'

import { Breadboard, TemplateImport, Component, Record } from '../../../BreadboardTypes'

export function toBreadboard(localBindNodes: ast.LocalBind[], objectNode: ast.ObjectNode | undefined): Breadboard {
    return {
        templateImports: localBindNodes.map(convertToTemplateImport).filter(x=>x) as TemplateImport[],
        components: (objectNode ? objectNode.fields.toArray() : []).map(convertToComponent).filter(x=>x) as Component[],
    }
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

function convertToComponent(node: ast.ObjectField): Component | undefined {
    if (
        node.expr2
        && (ast.isApplyBrace(node.expr2) || (ast.isBinary(node.expr2) && node.expr2.op == 'BopPlus'))
        && ast.isVar(node.expr2.left)
        && ast.isObjectNode(node.expr2.right)
    ) {
        return {
            identifier: node.id.name,
            templateImportVariableName: node.expr2.left.id.name,
            records: node.expr2.right.fields.toArray().map(convertToRecord).filter(x=>x) as Record[]
        }
    }
}

function convertToRecord(node: ast.ObjectField): Record | undefined {
    if (ast.isLiteralString(node.expr2) || ast.isLiteralNumber(node.expr2)) {
        return {
            identifier: node.id.name,
            value: node.expr2.value,
        }
    }
}
