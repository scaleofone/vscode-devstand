export interface RequestListing {
    directory: string
}

export interface RequestFindFiles {
    pattern: string
    exclude?: string
}
