import { derived, Readable, readable, Writable, writable, get } from 'svelte/store'

export const writablesAsText: Writable<string> = writable('')

export const ignoredAsText: Writable<string> = writable('')


interface GitignoreFile {
    dirname: string
    basename: string
    contents: string
}

function getGitignoreFiles(): GitignoreFile[] {
    // TODO parse other .gitignore files found within the app sources
    return [
        {
            dirname: '',
            basename: '.gitignore',
            // this is the default .gitignore file in the root directory of a fresh Laravel app
            contents: '/node_modules\n/public/hot\n/public/storage\n/storage/*.key\n/vendor\n.env\n.env.backup\n.phpunit.result.cache\nHomestead.json\nHomestead.yaml\nnpm-debug.log\nyarn-error.log\n',
        },
        {
            dirname: 'storage/logs',
            basename: '.gitignore',
            contents: '*\n!.gitignore\n',
        },
    ]
}

function prefixLinesWithDirname(gf: GitignoreFile): string[] {
    let dirnameWithSlash = (gf.dirname ? gf.dirname + '/' : '')

    let lines = gf.contents.split('\n').filter(notempty => notempty)
    lines = lines.map(line => line.replace(/^.\//, '').replace(/^\//, ''))
    lines = lines.map(line => {
        if (line.substr(0, 1) == '!') {
            return '!' + dirnameWithSlash + line.substr(1)
        } else {
            return dirnameWithSlash + line
        }
    })

    return lines
}

export function copyGitignore() {
    const bannerLines = [
        '# Prevent bloat in case running build process on a local machine in dirty working copy',
        '# (listing below comes from all .gitignore files found within the sources)'
    ]
    const linesPrefixedWithDirname = getGitignoreFiles().map(prefixLinesWithDirname)
        .map(lines => [...lines, '']) // add empty line after each parsed .gitignore

    ignoredAsText.update($ignoredAsText => {
        return $ignoredAsText
            + ($ignoredAsText ? '\n\n' : '')
            + bannerLines.join('\n') + '\n\n'
            + linesPrefixedWithDirname.flat(1).join('\n')
    })
}
