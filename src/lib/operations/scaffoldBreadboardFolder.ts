import vscode from 'vscode'
import execSync from '../shim/execSync'

export default async function (folderFromContextMenu: vscode.Uri): Promise<vscode.Uri | undefined> {
    try {
        return await scaffoldBreadboardFolder(folderFromContextMenu)
    } catch (err) {
        vscode.window.showErrorMessage('Could not scaffold breadboard directory. ' + err)
    }
}

async function scaffoldBreadboardFolder (folderFromContextMenu: vscode.Uri): Promise<vscode.Uri | undefined> {
    if (! Array.isArray(vscode.workspace.workspaceFolders)) {
        throw new Error('No folders open in the workspace')
    }
    let workspaceFolder: vscode.WorkspaceFolder = vscode.workspace.workspaceFolders[0]

    let jsonnetpkgJson = { deps: { } }
    jsonnetpkgJson.deps['github.com/jsonnet-libs/k8s-libsonnet'] = 'github.com/jsonnet-libs/k8s-libsonnet/1.19'
    jsonnetpkgJson.deps['github.com/jsonnet-libs/docsonnet/doc-util'] = 'github.com/jsonnet-libs/docsonnet/doc-util#HEAD'
    jsonnetpkgJson.deps['bitbucket.org/maxbublik/templates-jsonnet-apps'] = 'bitbucket.org/maxbublik/templates-jsonnet-apps#v0.0.4'
    jsonnetpkgJson.deps['bitbucket.org/maxbublik/templates-jsonnet-services'] = 'bitbucket.org/maxbublik/templates-jsonnet-services#v0.0.3'

    await vscode.workspace.fs.writeFile(
        vscode.Uri.joinPath(folderFromContextMenu, 'jsonnetpkg.json'),
        (new TextEncoder().encode(JSON.stringify(jsonnetpkgJson, null, 2)))
    )

    let breadboardJsonnetBasename = 'breadboard.jsonnet'
    let breadboardJsonnetText = '{}\n'

    await vscode.workspace.fs.writeFile(
        vscode.Uri.joinPath(folderFromContextMenu, breadboardJsonnetBasename),
        (new TextEncoder().encode(breadboardJsonnetText))
    )

    let gitignoreLines = ['jsonnetpkg']
    const gitignoreUri = vscode.Uri.joinPath(folderFromContextMenu, '.gitignore')
    let gitignoreExists = undefined
    let gitignoreText = ''
    try {
        let stat = await vscode.workspace.fs.stat(gitignoreUri)
        if (typeof stat == 'object' && stat && stat.type == vscode.FileType.File) {
            gitignoreExists = true
            gitignoreText = (await vscode.workspace.fs.readFile(gitignoreUri)).toString() + '\n'
        } else {
            gitignoreExists = false
        }
    } catch (err) {
        gitignoreExists = false
    }

    await vscode.workspace.fs.writeFile(
        gitignoreUri,
        (new TextEncoder().encode(gitignoreText + gitignoreLines.join('\n')))
    )

    execSync('devstand fetch', { encoding: 'utf8', cwd: folderFromContextMenu.path })

    return vscode.Uri.joinPath(folderFromContextMenu, breadboardJsonnetBasename)
}
