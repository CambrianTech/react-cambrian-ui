import {default as React} from "react";
import {SwatchItem} from "react-home-ar";
import {LazyImage} from "./LazyImage";

type ThumbnailProps = {
    swatch:SwatchItem
    className?:string,
    subSwatches?:SwatchItem[]
    resolveThumbnailPath:(swatch:SwatchItem, subSwatches?:SwatchItem[])=>string|undefined;
    visibilityWillChange?: (visible: boolean) => void;
}

export function Thumbnail(props: ThumbnailProps) {
    if (props.swatch.color) {
        return <div className={props.className} style={{backgroundColor:props.swatch.color}} />
    }
    return (
            <LazyImage className={props.className}
                 src={props.resolveThumbnailPath(props.swatch, props.subSwatches)}
                 alt={props.swatch.displayName} visibilityWillChange={props.visibilityWillChange} />
    )
}