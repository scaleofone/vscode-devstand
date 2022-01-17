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
