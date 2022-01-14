import vscode from 'vscode'
import { Breadboard } from './jsonnet/BreadboardTypes'

export default async function(document: vscode.TextDocument): Promise<Breadboard> {
    const text = document.getText()
    if (text.trim().length === 0) {
        return Promise.resolve({
            templateImports: [],
            components: [],
        })
    }
    try {
        return Promise.resolve(parseFromFile(text))
    } catch {
        return Promise.reject(new Error('Could not get document as json. Content is not valid json'))
    }
}
