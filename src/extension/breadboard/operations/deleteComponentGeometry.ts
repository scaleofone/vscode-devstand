import vscode from 'vscode'
import * as ast from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast'

import { DeleteComponent } from '../../../TransportPayloads'

import * as parser from '../jsonnet/JsonnetParser'

export default function (document: vscode.TextDocument, payload: DeleteComponent): vscode.TextEdit {
    const text = document.getText()
    const parsed = parser.parse(document.uri.path, text)
    const objectFieldNode = parser.getComponentFieldNode(parsed, 'meta')
    const targetNode = objectFieldNode.expr2

    if (! ast.isLiteralString(targetNode)) {
        throw new Error(`Node[type=${targetNode}] is unsupported`)
    }

    let meta: object
    try {
        meta = JSON.parse(targetNode.value)
    } catch (err) {
        throw new Error(`Could not parse JSON inside meta field`)
    }
    if (! ('geometry' in meta)) {
        meta['geometry'] = {}
    }

    delete meta['geometry'][payload.identifier]

    let beginLine = targetNode.loc.begin.line -1
    let beginColumn = targetNode.loc.begin.column -1
    let endLine = targetNode.loc.end.line -1
    let endColumn = targetNode.loc.end.column -1

    return vscode.TextEdit.replace(
        new vscode.Range(beginLine, beginColumn, endLine, endColumn),
        JSON.stringify(meta)
    )
}
