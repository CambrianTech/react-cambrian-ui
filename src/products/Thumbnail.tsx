import {default as React, useCallback, useEffect} from "react";
import {SwatchItem} from "react-home-ar";
import {ImageInfo, LazyImage} from "./LazyImage";
import {isDarkColor} from "../internal/Utils";

type ThumbnailProps = {
    swatch:SwatchItem
    className?:string,
    subSwatches?:SwatchItem[]
    resolveThumbnailPath:(swatch:SwatchItem, subSwatches?:SwatchItem[])=>string|undefined;
    visibilityWillChange?: (visible: boolean) => void;
    onload?:(swatch:SwatchItem, info?:ImageInfo)=>void
}

const _isDarkLookup: { [key: string]: boolean } = {};

export function isDarkSwatch(swatch:SwatchItem) {
    if (swatch.key in _isDarkLookup) {
        return _isDarkLookup[swatch.key]
    }
    return false
}

export function Thumbnail(props: ThumbnailProps) {

    const imageLoaded = useCallback((data:ImageInfo)=>{
        if (props.onload) {
            _isDarkLookup[props.swatch.key] = data.isDark;
            props.onload(props.swatch, data);
        }
    }, [props])

    useEffect(()=>{
        if (props.swatch.color && props.onload) {
            _isDarkLookup[props.swatch.key] = isDarkColor(props.swatch.color);
            props.onload(props.swatch);
        }
    })

    if (props.swatch.color) {
        return <div className={props.className} style={{backgroundColor:props.swatch.color}} />
    }

    return (
        <LazyImage
            className={props.className}
            src={props.resolveThumbnailPath(props.swatch, props.subSwatches)}
            alt={props.swatch.displayName}
            visibilityWillChange={props.visibilityWillChange}
            imageLoaded={imageLoaded}
        />
    )
}