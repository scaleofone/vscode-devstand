export interface ImportNode {
    type: 'ImportNode',
    file: string,
}

export interface LocalBindNode {
    variable: IdentifierNode,
    body: IndexNode,
}

export interface VarNode {
    type: 'VarNode',
    id: IdentifierNode,
}

export interface DollarNode {
    type: 'DollarNode'
}

export interface IndexNode {
    type: 'IndexNode',
    id: IdentifierNode,
    target: DollarNode | IndexNode | ImportNode,
}

export interface LiteralStringNode {
    type: 'LiteralStringNode',
    value: string,
}

export interface LiteralNumberNode {
    type: 'LiteralNumberNode',
    originalString: string,
    value: number,
}

export interface BinaryNode {
    type: 'BinaryNode',
    op: 'BopPlus',
    left: VarNode | IndexNode,
    right: ObjectNode,
}

export interface ApplyBraceNode {
    type: 'ApplyBraceNode',
    left: VarNode | IndexNode,
    right: ObjectNode,
}

export interface IdentifierNode {
    type: 'IdentifierNode',
    name: string,
}

export interface ObjectFieldNode {
    type: 'ObjectFieldNode',
    id: IdentifierNode,
    expr2: LiteralStringNode | LiteralNumberNode | ObjectNode | IndexNode | ApplyBraceNode | BinaryNode,
}

export interface ObjectNode {
    type: 'ObjectNode',
    fields: ObjectFieldNode[],
}
