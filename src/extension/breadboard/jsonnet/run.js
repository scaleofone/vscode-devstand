import { readFileSync } from 'fs'
import * as parser from './JsonnetParser'
import * as converter from './BreadbordConverter'

const filePath = '/Users/max/Dst/kitchen-sink/tmp/breadboard.jsonnet'
const fileText = readFileSync(filePath, { encoding: 'utf-8' })

const ast = parser.toJson(parser.parse(filePath, fileText))
if (! ast.type) throw new Error

const breadboard = converter.toBreadboard(
    parser.getLocalBindNodes(ast),
    parser.getObjectNode(ast)
)

console.log(JSON.stringify(breadboard, null, '  '))


// Run this file (--platform=node)
// ./node_modules/.bin/esbuild  src/extension/breadboard/jsonnet/run.js --bundle --external:fs     --platform=node  |  node -

// Build as ESM
// ./node_modules/.bin/esbuild  src/extension/breadboard/jsonnet/run.js --bundle --external:fs     --format=esm --outfile=run.js  &&  node run.js
