import * as ast from '../../../../heptio-vscode-jsonnet/compiler/lexical-analysis/ast'

export function convertToReference(node: ast.Index): string[] {
    let result = [node.id.name]
    if (ast.isIndex(node.target)) {
        result = [...result, ...convertToReference(node.target).flat(1)]
    }
    if (ast.isDollar(node.target)) {
        result = [...result, '$']
    }
    return result
}

export function convertToConcatenation(node: ast.Binary): Array<string | string[]> {
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


export function concatenationStringToEditableString(cstr: string): string {
    const regex1 = /(\$\.[a-zA-Z0-9_\.]*)/gm
    const regex2 = /(^')|('$)|('\s{0,}\+\s{0,})|(\s{0,}\+\s{0,}')/gm
    return cstr.replace(regex1, `{$1}`).replace(regex2, ``)
}

export function editableStringToConcatenationString(estr: string): string {
    const regex1 = /{(\$\.[a-zA-Z0-9_\.]*)}/gm
    let result = `'` + estr.replace(regex1, `' + $1 + '`) + `'`
    const regex2 = /(''\s{0,}\+\s{0,})|(\s{0,}\+\s{0,}'')/gm
    result = result.replace(regex2, ``)
    return result
}

export function isEditableString(estr: string): boolean {
    const regex1 = /{\$\.[a-zA-Z0-9_\.]*}/gm
    return !! estr.match(regex1)
}
