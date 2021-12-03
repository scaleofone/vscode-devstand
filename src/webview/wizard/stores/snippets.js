import { writable, derived } from 'svelte/store'
import { get_store_value } from 'svelte/internal'

export const htmlContent = writable("<html>\n  hello world\n</html>")
export const cssContent = writable(".red {\n  color: red;\n}")

const cssLink = "\n  <link href=style.css rel=stylesheet>";
const pasteCssLinkIfNecessary = cssContent.subscribe(cssContentValue => {
    if (cssContentValue.trim()) {
        htmlContent.update(v => v.includes(cssLink) ? v : v.replace('<html>', '<html>'+cssLink))
    } else {
        htmlContent.update(v => v.replace(cssLink, ''))
    }
})

export const filesToSave = derived(
    [cssContent, htmlContent],
    ([$cssContent, $htmlContent]) => {
        let result = []
        if ($htmlContent.trim()) {
            result.push('index.html')
            if ($cssContent.trim()) {
                result.push('style.css')
            }
        }
        return result
    },
    []
)

// TODO not related to the class
export const getFileContent = (filename) => {
    if (filename == 'index.html') {
        return get_store_value(htmlContent)
    }
    if (filename == 'style.css') {
        return get_store_value(cssContent)
    }
}
