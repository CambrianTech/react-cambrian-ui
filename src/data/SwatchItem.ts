
export interface SwatchItem {
    key:string
    thumbnail?: string
    displayName?: string
    description?: string
    hasColumns:boolean
}

export interface SwatchListing {
    children:SwatchItem[]
}