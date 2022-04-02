export interface RequestListing {
    directory: string
}

export interface RequestFindFiles {
    pattern: string
    exclude?: string
}

export interface SetOpenedFromFolder {
    path: string
    workspaceFolderPath: string
}

export interface CreateFile {
    dirname: string
    basename: string
    contents?: string
}

export interface NotifyFilesCreated {
    message: string
    filesToOpenOnClick: CreateFile[]
}
