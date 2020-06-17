import {default as React} from "react";
import {SwatchItem} from "react-home-ar";

type ThumbnailProps = {
    swatch:SwatchItem
    className?:string,
    subSwatches?:SwatchItem[]
    resolveThumbnailPath:(swatch:SwatchItem, subSwatches?:SwatchItem[])=>string|undefined
}

export function Thumbnail(props: ThumbnailProps) {
    if (props.swatch.color) {
        return <div className={props.className} style={{backgroundColor:props.swatch.color}} />
    }
    return (
            <img className={props.className}
                 src={props.resolveThumbnailPath(props.swatch, props.subSwatches)}
                 alt={props.swatch.displayName}
                 style={{backgroundColor:props.swatch.color}} />
    )
}