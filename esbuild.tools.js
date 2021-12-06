// original version from https://github.com/EMH333/esbuild-svelte/blob/main/index.ts
import { compile } from 'svelte/compiler'
import { dirname, relative } from 'path'
import { promisify } from 'util'
import fs from 'fs'

const sleep = (delay) => new Promise(resolve => setTimeout(resolve, delay))

const convertMessage = ({ message, start, end, filename, frame }) => ({
    text: message,
    location: (start && end) ? { file: filename, line: start.line, column: start.column, length: start.line === end.line ? end.column - start.column : 0, lineText: frame } : null,
})

const sveltePlugin = function (options) {
    return {
        name: 'svelte',
        setup(build) {
            //Store generated css code for use in fake import
            const cssCode = new Map()

            build.onLoad({ filter: /\.svelte$/ }, async (args) => {
                let source = await promisify(fs.readFile)(args.path, 'utf8')
                let filename = relative(process.cwd(), args.path)

                try {
                    let compileOptions = { css: false, ...(
                        typeof options?.compileOptions == 'function' ? options.compileOptions(filename) : options?.compileOptions
                    )}
                    // console.log(filename, compileOptions)

                    let { js, css, warnings } = compile(source, { ...compileOptions, filename })
                    let contents = js.code

                    //if svelte emits css seperately, then store it in a map and import it from the js
                    if (!compileOptions.css && css.code) {
                        let cssPath = args.path.replace('.svelte', '.esbuild-svelte-fake-css').replace(/\\/g, '/')
                        cssCode.set(cssPath, css.code)
                        contents = contents + `\nimport "${cssPath}";`
                    }

                    return { contents, warnings: warnings.map(convertMessage) }

                } catch (e) {
                    return { errors: [convertMessage(e)] }
                }
            });

            //if the css exists in our map, then output it with the css loader
            build.onResolve({ filter: /\.esbuild-svelte-fake-css$/ }, ({ path }) => {
                return { path, namespace: 'fakecss' }
            });
            build.onLoad({ filter: /\.esbuild-svelte-fake-css$/, namespace: 'fakecss' }, ({ path }) => {
                const css = cssCode.get(path)
                return css ? { contents: css, loader: 'css', resolveDir: dirname(path) } : null
            })
        },
    }
}

const parseCliParams = (argv) => {
    return (argv || process.argv).slice(2).reduce(({ params, options }, arg) => {
        let regex = arg.match(/^--(?<name>[^=]*)(=(?<value>.*))?$/)
        if (regex && regex.groups.name) {
            if (regex.groups.name in options) {
                options[regex.groups.name] = [ options[regex.groups.name] ]
                options[regex.groups.name].push(regex.groups.value || true)
            } else {
                options[regex.groups.name] = regex.groups.value || true
            }
        } else {
            params.push(arg)
        }
        return { params, options }
    }, {
        params: [],
        options: {},
    })
}

const noopPlugin = () => ({
    name: 'noop',
    setup(build) {},
})

const rmrf = (dirPath, removeDirectoryItself) => {
    if (fs.existsSync(dirPath)) {
        let files = fs.readdirSync(dirPath)
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let filePath = dirPath + '/' + files[i]
                if (fs.lstatSync(filePath).isDirectory()) {
                    rmrf(filePath)
                } else {
                    fs.unlinkSync(filePath)
                }
            }
        }
        if (removeDirectoryItself) {
            fs.rmdirSync(dirPath)
        }
    }
}

const cleanDir = (dirPath) => {
    rmrf(dirPath, false)
}

export {
    sveltePlugin,
    noopPlugin,
    parseCliParams,
    rmrf,
    cleanDir,
}
