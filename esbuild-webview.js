import esbuild from 'esbuild'
import { parseCliParams, sveltePlugin } from './esbuild.tools.js'
const { options } = parseCliParams()

esbuild
    .build({
        outdir: 'dist/webview/',
        entryPoints: [
            'src/webview/editor/editor.js',
            'src/webview/wizard/wizard.js',
            'src/webview/kicker/kicker.js',
        ],
        metafile: true,
        platform: 'browser',
        format: 'iife',
        bundle: true,
        minify: !! options.minify,
        splitting: false,
        sourcemap: false,
        loader: {
            '.svg': 'text',
        },
        plugins: [
            sveltePlugin({
                // [options for svelte.compile](https://svelte.dev/docs#svelte_compile)
                compileOptions: {
                    dev: ! options.minify,
                }
            }),
        ],
        watch: (options.watch ? {
            onRebuild(error, result) {
                console.log('[watch] build started')
                if (error) {
                    error.errors.forEach(error => console.error(`> ${error.location.file}:${error.location.line}:${error.location.column}: error: ${error.text}`))
                } else {
                    console.log('[watch] build sucessfull')
                }
            },
        } : false),
    })
    .then(() => options.watch && console.log('[watch] build sucessfull'))
    .catch(() => process.exit(1))
