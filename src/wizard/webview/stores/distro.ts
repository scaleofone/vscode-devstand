import { derived, Readable, readable, Writable, writable, get } from 'svelte/store'
import { extension } from '../transport'
import { dockerfileAsText, dockerignoreAsText, entrypointAsText } from './dummy'
import { CreateFile } from '../../TransportPayloads'

export const workspaceFolderPath: Writable<string> = writable(undefined)

export const openedFromFolderPath: Writable<string> = writable(undefined)

export const dirname: Readable<string> = derived([workspaceFolderPath, openedFromFolderPath], ([$workspaceFolderPath, $openedFromFolderPath]) => {
    if (! $workspaceFolderPath) {
        return ''
    }
    if ($workspaceFolderPath && $openedFromFolderPath) {
        return $openedFromFolderPath.replace($workspaceFolderPath, '').replace(/^\//, '')
    }
})

export function performSave() {
    let filesToCreate: CreateFile[] = []
    let filesToOpenOnClick: CreateFile[] = []

    let $dirname = get(dirname)

    filesToCreate.push({
        dirname: '',
        basename: '.dockerignore',
        contents: dockerignoreAsText,
    })
    filesToCreate.push({
        dirname: $dirname,
        basename: 'entrypoint.sh',
        contents: entrypointAsText,
    })
    filesToCreate.push({
        dirname: $dirname,
        basename: 'Dockerfile',
        contents: dockerfileAsText,
    })
    filesToOpenOnClick.push({
        dirname: $dirname,
        basename: 'Dockerfile',
    })


    if (filesToCreate.length == 0) {
        extension.showMessage('No files to save')
    }

    extension.createFiles(filesToCreate)
    .then(() => {
        if (filesToOpenOnClick.length > 0) {
            extension.notifyFilesCreated({ filesToOpenOnClick, message: 'Dockerfile saved to your local directory' })
        } else {
            extension.showMessage('Files saved successfully')
        }
    })
    .catch(err => console.log('Could not save files', err))
}
