import * as React from "react";
import classes from "./HorizontalListing.scss";
import {SwatchItem} from "../data";
import {Thumbnail} from "../general";

type HorizontalListingProps = {
    visible: boolean,
    className?:string
    columns?:SwatchItem[]
    selectedSwatch?:SwatchItem,
    onClick:(item:SwatchItem)=>void
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
        if (cProps.visible && cProps.columns) {
            let className = appendClassName("horizontal-swatch-listing", classes.horizontalListing)
            className = appendClassName(className, cProps.className)
            return (
                <div className={className}>
                    <div className={appendClassName("horizontal-swatch-listing-content", classes.horizontalListingContent)}>
                        {cProps.columns.map((swatch) => {
                            let className = appendClassName("horizontal-swatch-listing-item",
                                cProps.selectedSwatch === swatch ? classes.horizontalListingItemSelected : classes.horizontalListingItem)

                            if (cProps.selectedSwatch === swatch) {
                                className = appendClassName(className, "selected")
                            }

                            return (
                                <div key={swatch.key} onClick={()=>cProps.onClick(swatch)} className={className}>
                                    <div className={appendClassName("horizontal-swatch-listing-details", classes.horizontalListingDetails)}>
                                        <Thumbnail className={appendClassName("horizontal-swatch-listing-image", classes.horizontalListingImage)} swatch={swatch} resolveThumbnailPath={cProps.resolveThumbnailPath} />
                                        <div className={appendClassName("horizontal-swatch-listing-info", classes.horizontalListingInfo)}>
                                            {swatch.displayName}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
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