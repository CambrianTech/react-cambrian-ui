
export interface SwatchItem {
    key:string
    thumbnail?: string
    displayName?: string
    description?: string
}

export interface SwatchListing {
    children:SwatchItem[]
}