import esbuild from 'esbuild'
import { parseCliParams, sveltePlugin } from './esbuild.tools.mjs'
const { options } = parseCliParams()

esbuild
    .build({
        outdir: 'dist/webview/',
        entryPoints: [
            'src/breadboard/webview/index.js',
            'src/wizard/webview/index.js',
        ],
        metafile: true,
        platform: 'browser',
        format: 'iife',
        bundle: true,
        minify: !! options.minify,
        splitting: false,
        sourcemap: options.sourcemap ? 'inline' : false,
        loader: {
            '.svg': 'text',
            '.png': 'base64',
        },
        plugins: [
            sveltePlugin({
                // [options for svelte.compile](https://svelte.dev/docs#compile-time-svelte-compile)
                compileOptions: {
                    dev: ! options.minify,
                    enableSourcemap: !! options.sourcemap,
                }
            }),
        ],
        watch: (options.watch ? {
            onRebuild(error, result) {
                console.log('[watch] build started')
                if (error) {
                    error.errors.forEach(error => console.error(`> ${error.location.file}:${error.location.line}:${error.location.column}: error: ${error.text}`))
                } else {
                    console.log('[watch] build finished')
                }
            },
        } : false),
    })
    .then(() => options.watch && console.log('[watch] build finished'))
    .catch(() => process.exit(1))
