import { derived, Readable, readable, Writable, writable, get } from 'svelte/store'
import { Server, servers } from './dictionaries'

const unique = (item: any, pos: number, self: any[]) => self.indexOf(item) == pos

export const availableServers: Readable<Server[]> = readable(servers)

export const selectedServerPackage: Writable<string> = writable(undefined)

export const selectedServer: Readable<Server> = derived([availableServers, selectedServerPackage], ([$availableServers, $selectedServerPackage]) => {
    return $availableServers.find(s => s.package == $selectedServerPackage)
})


export const detectedFrontControllersPaths: Writable<string[]> = writable([
    './public/index.php',
    './bootstrap/app.php',
])

interface FrontControllerData {
    path: string
    basename: string
    dirname: string
}

function pathToFrontControllerData(path: string): FrontControllerData {
    let splits = path.split('/')
    let basename = splits.pop()
    let dirname = splits.join('/') + '/'
    return { path, basename, dirname }
}

const detectedFrontControllersData: Readable<FrontControllerData[]> = derived(detectedFrontControllersPaths, ($detectedFrontControllersPaths) => {
    return $detectedFrontControllersPaths.map(pathToFrontControllerData)
})

export const availableDocumentRoots: Readable<string[]> = derived(detectedFrontControllersData, ($detectedFrontControllersData) => {
    return $detectedFrontControllersData.map(fcd => fcd.dirname).filter(unique)
})

export const selectedDocumentRoot: Writable<string> = writable(undefined)

detectedFrontControllersData.subscribe($detectedFrontControllersData => {
    if ($detectedFrontControllersData.length > 0 && ! get(selectedDocumentRoot)) {
        selectedDocumentRoot.set($detectedFrontControllersData[0].dirname)
    }
})

export const availableFrontControllers: Readable<string[]> = derived([detectedFrontControllersData, selectedDocumentRoot], ([$detectedFrontControllersData, $selectedDocumentRoot]) => {
    return $detectedFrontControllersData.filter(fcd => fcd.dirname == $selectedDocumentRoot).map(fcd => fcd.basename)
})

export const selectedFrontController: Writable<string> = writable(undefined)

availableFrontControllers.subscribe($availableFrontControllers => {
    let $selectedDocumentRoot = get(selectedDocumentRoot)
    if ($selectedDocumentRoot) {
        if ($availableFrontControllers.length === 1) {
            selectedFrontController.set($availableFrontControllers[0])
        } else {
            selectedFrontController.set(undefined)
        }
    }
})

export const exposedPort: Writable<number> = writable(8080)
