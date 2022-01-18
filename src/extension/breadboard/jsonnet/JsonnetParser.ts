import * as ast from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast'
import * as lexer from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/lexer'
import * as lexical from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/lexical'
import * as parser from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/parser'

export function parse(filePath: string, fileText: string): ast.Node {
    const lexResult = lexer.Lex(filePath, fileText)
    if (lexical.isStaticError(lexResult)) {
        throw new Error('LEX ERROR')
    }
    const parseResult = parser.Parse(lexResult)
    if (lexical.isStaticError(parseResult)) {
        throw new Error('PARSE ERROR')
    }
    return parseResult
}

export function getLocalBindNodes(parsed: ast.Node): ast.LocalBind[] {
    let localBindNodes: ast.LocalBind[] = []
    function extractLocalBindNodes(item: ast.Node) {
        if (ast.isLocal(item)) {
            localBindNodes.push(...item.binds.toArray())
            extractLocalBindNodes(item.body)
        }
    }
    extractLocalBindNodes(parsed)
    return localBindNodes
}

export function getObjectNode(parsed: ast.Node): ast.ObjectNode | undefined {
    function findObjectNode(item: ast.Node) {
        if (ast.isObjectNode(item)) {
            return item
        }
        if (ast.isLocal(item)) {
            return findObjectNode(item.body)
        }
    }
    return findObjectNode(parsed)
}

export function getComponentFieldNode(parsed: ast.Node, identifier: string): ast.ObjectField {
    const objectNode = getObjectNode(parsed)
    if (objectNode == undefined) {
        throw new Error(`ObjectNode not found`)
    }
    const objectFieldNode = objectNode.fields.find(objectFieldNode => objectFieldNode.id.name == identifier)
    if (objectFieldNode == undefined) {
        throw new Error(`Could not find Component[identifier=${ identifier }]`)
    }
    return objectFieldNode
}

export function getRecordFieldNode(parsed: ast.Node, componentIdentifier: string, recordIdentifier: string): ast.ObjectField {
    const componentFieldNode = getComponentFieldNode(parsed, componentIdentifier)
    if (! (
        componentFieldNode.expr2
        && (ast.isApplyBrace(componentFieldNode.expr2) || (ast.isBinary(componentFieldNode.expr2) && componentFieldNode.expr2.op == 'BopPlus'))
        && ast.isVar(componentFieldNode.expr2.left)
        && ast.isObjectNode(componentFieldNode.expr2.right)
    )) {
        throw new Error(`Component[identifier=${ componentIdentifier }] is not a proper component`)
    }
    const componentObjectNode = componentFieldNode.expr2.right

    const recordFieldNode = componentObjectNode.fields.find(recordFieldNode => recordFieldNode.id.name == recordIdentifier)
    if (recordFieldNode == undefined) {
        throw new Error(`Could not find Record[identifier=${ recordIdentifier }] within Component[identifier=${ componentIdentifier }]`)
    }
    return recordFieldNode
}
