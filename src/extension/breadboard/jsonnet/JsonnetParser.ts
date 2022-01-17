import { Lex } from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/lexer'
import { isStaticError } from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/lexical'
import { Parse } from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/parser'
import { renderAsJson } from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast/tree'

import { LocalBindNode, ObjectNode } from './JsonnetTypes'

export function parse(filePath: string, fileText: string) {
    const lexResult = Lex(filePath, fileText)
    if (isStaticError(lexResult)) {
        throw new Error('LEX ERROR')
    }
    const parseResult = Parse(lexResult)
    if (isStaticError(parseResult)) {
        throw new Error('PARSE ERROR')
    }
    return parseResult
}

export function toJson(parseResult) {
    const asJson = renderAsJson(parseResult)
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
