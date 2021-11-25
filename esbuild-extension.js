import esbuild from 'esbuild'

import { parseCliParams } from './esbuild.tools.js'
const { options } = parseCliParams()

esbuild
    .build({
        outdir: 'dist/extension/',
        entryPoints: [
            'src/extension/extension.ts'
        ],
        platform: 'node',
        format: 'cjs',
        outExtension: {
            '.js': '.cjs'
        },
        external: [
            'vscode'
        ],
        bundle: true,
        minify: !! options.minify,
        splitting: false,
        sourcemap: false,
        metafile: true,
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