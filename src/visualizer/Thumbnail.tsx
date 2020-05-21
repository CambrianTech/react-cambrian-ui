import {default as React} from "react";
import {SwatchItem} from "../data";

type ThumbnailProps = {
    swatch:SwatchItem
    className?:string,
    resolveThumbnailPath:(swatch:SwatchItem)=>string|undefined
}

export function Thumbnail(props: ThumbnailProps) {
    if (props.swatch.color) {
        return <div className={props.className} style={{backgroundColor:props.swatch.color}} />
    }
    return <img className={props.className}
                src={props.resolveThumbnailPath(props.swatch)}
                alt={props.swatch.displayName}
                style={{backgroundColor:props.swatch.color}} />
}