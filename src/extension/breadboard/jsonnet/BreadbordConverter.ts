import { LocalBindNode, ObjectNode, ObjectFieldNode } from './JsonnetTypes'
import { Breadboard, TemplateImport, Component, ComponentRecord } from './BreadboardTypes'

export function toBreadboard(localBindNodes: LocalBindNode[], objectNode: ObjectNode | undefined): Breadboard {
    return {
        templateImports: localBindNodes.map(convertToTemplateImport).filter(x=>x) as TemplateImport[],
        components: (objectNode ? objectNode.fields : []).map(convertToComponent).filter(x=>x) as Component[],
    }
}

function convertToTemplateImport(node: LocalBindNode): TemplateImport | void {
    if (node.body.target.type == 'ImportNode') {
        return {
            variableName: node.variable.name,
            targetFile: node.body.target.file,
            targetIdentifier: node.body.id.name,
        }
    }
}

function convertToComponent(node: ObjectFieldNode): Component | void {
    if (
        (node.expr2.type == 'ApplyBraceNode' || node.expr2.type == 'BinaryNode')
        && node.expr2.left.type == 'VarNode'
    ) {
        return {
            identifier: node.id.name,
            templateImportVariableName: node.expr2.left.id.name,
            records: node.expr2.right.fields.map(convertToComponentRecord).filter(x=>x) as ComponentRecord[]
        }
    }
}

function convertToComponentRecord(node: ObjectFieldNode): ComponentRecord | void {
    if (node.expr2.type == 'LiteralStringNode' || node.expr2.type == 'LiteralNumberNode') {
        return {
            identifier: node.id.name,
            value: node.expr2.value,
        }
    }
}
