import * as React from "react";
import classes from "./HorizontalListing.scss";
import {SwatchItem, SwatchListing} from "../data";

type HorizontalListingProps = {
    visible: boolean,
    className?:string
    parent?:SwatchListing
    selectedSwatch?:SwatchItem
    resolveThumbnailPath:(swatch:SwatchItem)=>string|undefined
}

function appendClassName(current:string, name:string|undefined) {
    if (name) {
        return `${current} ${name}`
    }
    return current
}

export const HorizontalListingCached = React.memo<HorizontalListingProps>(
    (cProps) => {
        if (cProps.visible && cProps.parent) {
            let className = appendClassName("horizontal-swatch-listing", classes.horizontalListing)
            className = appendClassName(className, cProps.className)
            return (
                <div className={className}>
                    {cProps.parent.children.map((swatch) => {
                        return (
                            <div key={swatch.key} className={appendClassName("swatch-item", classes.horizontalListingItem)}>
                                <img className={appendClassName("swatch-image", classes.horizontalListingSwatch)} src={cProps.resolveThumbnailPath(swatch)} alt={swatch.displayName} />
                                <div className={appendClassName("swatch-info", classes.horizontalListingInfo)}>
                                    {swatch.displayName}
                                </div>
                            </div>
                        )
                    })}
                </div>
            );
        }
        return (<aside />);
    }
);

export function HorizontalListing(props: HorizontalListingProps) {

    return (
        <HorizontalListingCached {...props} />
    )
}