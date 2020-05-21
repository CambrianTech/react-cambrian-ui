export interface SwatchItem {
    key:string
    thumbnail?: string,
    color?: string
    displayName?: string
    description?: string
    hasColumns:boolean
    parent:SwatchItem|undefined
    children:SwatchItem[]
}
