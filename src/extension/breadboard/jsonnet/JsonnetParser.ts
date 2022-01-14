import { Lex, Tokens } from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/lexer'
import { Parse } from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/parser'
import { Node, renderAsJson } from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast/tree'

import { LocalBindNode, ObjectNode } from './JsonnetTypes'

export function parseAst(filePath: string, fileText: string) {
    const lexResult = Lex(filePath, fileText)
    const parseResult = Parse(lexResult as Tokens)
    const asJson = renderAsJson(parseResult as Node)
    return JSON.parse(asJson.substr(4, asJson.length-8))
}

export function getLocalBindNodes(ast: object): LocalBindNode[] {
    let localBindNodes: LocalBindNode[] = []
    function extractLocalBindNodes(item: any) {
        if (! (typeof item == 'object' && item)) return
        if (Array.isArray(item.binds)) {
            for (let bindNode of item.binds) {
                if (typeof bindNode == 'object' && bindNode && bindNode.type == 'LocalBindNode') {
                    localBindNodes.push(bindNode)
                }
            }
        }
        extractLocalBindNodes(item.body)
    }
    extractLocalBindNodes(ast)
    return localBindNodes
}

export function getObjectNode(ast: object): ObjectNode | undefined {
    let objectNode: ObjectNode | undefined = undefined
    function findObjectNode(item: any) {
        if (! (typeof item == 'object' && item && 'type' in item)) return
        if (item.type == 'ObjectNode') {
            objectNode = item
        } else {
            findObjectNode(item.body)
        }
    }
    findObjectNode(ast)
    return objectNode
}
