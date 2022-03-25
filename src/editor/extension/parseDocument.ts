import vscode from 'vscode'

export default async function(document: vscode.TextDocument): Promise<number[]> {
    const text = document.getText()
    if (text.trim().length === 0) {
        return Promise.resolve([0, 0])
    }
    try {
        const json = JSON.parse(text)
        return Promise.resolve([ json.top, json.left ])
    } catch {
        return Promise.reject(new Error('Could not get document as json. Content is not valid json'))
    }
}
