import esbuild from 'esbuild'

import { parseCliParams } from './esbuild.tools.mjs'
const { options } = parseCliParams()

esbuild
    .build({
        entryPoints: [
            'src/extension.ts'
        ],
        ...(
            options.web ? {
                platform: 'browser',
                format: 'cjs',
                outfile: 'dist/extension/browser.js',
            } : {
                platform: 'node',
                format: 'cjs',
                outfile: 'dist/extension/main.js',
            }
        ),
        external: [
            'vscode',
            'child_process',
        ],
        bundle: true,
        minify: !! options.minify,
        splitting: false,
        sourcemap: options.sourcemap ? 'inline' : false,
        metafile: true,
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
