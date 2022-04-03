import vscode from 'vscode'
import child_process from 'child_process'

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
    jsonnetpkgJson.deps['bitbucket.org/maxbublik/templates-jsonnet-apps'] = 'bitbucket.org/maxbublik/templates-jsonnet-apps#v0.0.1'

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
    await vscode.workspace.fs.writeFile(
        vscode.Uri.joinPath(folderFromContextMenu, '.gitignore'),
        (new TextEncoder().encode(gitignoreLines.join('\n')))
    )

    child_process.execSync('devstand fetch', { encoding: 'utf8', cwd: folderFromContextMenu.path })

    return vscode.Uri.joinPath(folderFromContextMenu, breadboardJsonnetBasename)
}
