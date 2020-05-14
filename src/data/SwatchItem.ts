
export interface SwatchItem {
    key:string
    thumbnailPath?: string
    displayName?: string
    description?: string
}

export interface SwatchListing {
    children:SwatchItem[]
}