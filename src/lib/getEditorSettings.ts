import vscode from 'vscode'
import { EditorSettings } from './editorSettings'

export function getEditorSettings(): EditorSettings {
    const editorConfig = vscode.workspace.getConfiguration('editor')
    const fontSize = parseFloat(editorConfig.get('fontSize').toString())
    const lineHeightSetting = parseFloat(editorConfig.get('lineHeight').toString())
    let lineHeight: number, lineHeightFraction: number
    if (lineHeightSetting < 8) {
        lineHeightFraction = (lineHeightSetting == 0) ? 1.5 : lineHeightSetting
        lineHeight = Math.round(fontSize * lineHeightFraction)
    } else {
        lineHeight = Math.round(lineHeightSetting)
        lineHeightFraction = parseFloat((lineHeight / fontSize).toFixed(1))
    }
    const halfFontSize = Math.round(fontSize / 2)
    const quaterFontSize = Math.round(fontSize / 4)

    return { fontSize, lineHeight, lineHeightFraction, halfFontSize, quaterFontSize }
}
