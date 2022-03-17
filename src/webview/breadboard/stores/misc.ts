import { Writable, writable } from 'svelte/store'
import { EditorSettings } from '../../../TransportPayloads'

export const editorSettings: Writable<EditorSettings> = writable({
    fontSize: 12,
    halfFontSize: 6,
    quaterFontSize: 3,
    lineHeight: 18,
    lineHeightFraction: 1.5
})

editorSettings.subscribe((editorSettings) => {
    Object.keys(editorSettings)
        .filter(key => ['number', 'string'].includes(typeof editorSettings[key]))
        .forEach(key => document.documentElement.style.setProperty('--editorSettings-'+key, editorSettings[key]))
})
