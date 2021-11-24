import esbuild from 'esbuild'
import { parseCliParams, sveltePlugin } from './esbuild.tools.js'
const { options } = parseCliParams()

esbuild
    .build({
        outdir: 'dist/webview/',
        entryPoints: [
            'src/webview/editor/entrypoint.js',
            'src/webview/wizard/entrypoint.js',
        ],
        metafile: true,
        platform: 'browser',
        format: 'iife',
        bundle: true,
        minify: !! options.minify,
        splitting: false,
        sourcemap: false,
        watch: !! options.watch,
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
    })
    .catch(() => process.exit(1))
