import esbuild from 'esbuild'

import { parseCliParams, cleanDir } from './esbuild.tools.js'
const { options } = parseCliParams()

if (! options.noclean) {
    cleanDir('dist/extension')
}

esbuild
    .build({
        outdir: 'dist/extension/',
        entryPoints: [
            'src/extension/extension.ts'
        ],
        ...(
            options.web ? {
                platform: 'browser',
                format: 'cjs',
            } : {
                platform: 'node',
                format: 'cjs',
                outExtension: {
                    '.js': '.cjs'
                },
            }
        ),
        external: [
            'vscode'
        ],
        bundle: true,
        minify: !! options.minify,
        splitting: false,
        sourcemap: !! options.sourcemap,
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
