export interface SwatchItem {
    key:string
    thumbnail?: string
    displayName?: string
    description?: string
    hasColumns:boolean
    parent:SwatchItem|undefined
    children:SwatchItem[]
}
