import * as React from "react";
import classes from "./VerticalListing.scss";
import {SwatchItem, SwatchListing} from "../data";
import {HorizontalListing} from "./HorizontalListing";

type VerticalListingProps = {
    visible: boolean,
    className?:string
    parent?:SwatchListing
    selectedRow?:SwatchItem|SwatchListing
    onRowSelected:(item:SwatchItem)=>void
    resolveThumbnailPath:(swatch:SwatchItem)=>string|undefined
}

function appendClassName(current:string, name:string|undefined) {
    if (name) {
        return `${current} ${name}`
    }
    return current
}

export const VerticalListingCached = React.memo<VerticalListingProps>(
    (cProps) => {
        if (cProps.visible && cProps.parent) {
            let className = appendClassName("vertical-swatch-listing", classes.verticalListing)
            className = appendClassName(className, cProps.className)

            return (
                <div className={className}>
                    <div className={appendClassName("vertical-swatch-listing-content", classes.verticalListingContent)}>
                        {cProps.parent.children.map((swatch) => {
                            return (
                                <div key={swatch.key} className={appendClassName("vertical-swatch-listing-item", classes.verticalListingItem)} onClick={()=>cProps.onRowSelected(swatch)}>
                                    <div className={appendClassName("vertical-swatch-listing-details", classes.verticalListingDetails)}>
                                        <img className={appendClassName("vertical-swatch-listing-image", classes.verticalListingSwatch)} src={cProps.resolveThumbnailPath(swatch)} alt={swatch.displayName} />
                                        <div className={appendClassName("vertical-swatch-listing-info", classes.verticalListingInfo)}>
                                            <div className={appendClassName("vertical-swatch-listing-title", classes.verticalListingTitle)}>{swatch.displayName}</div>
                                            <div className={appendClassName("vertical-swatch-listing-description", classes.verticalListingDescription)}>{swatch.description}</div>
                                        </div>
                                    </div>
                                    <HorizontalListing visible={cProps.selectedRow === swatch} resolveThumbnailPath={cProps.resolveThumbnailPath}
                                                       parent={cProps.selectedRow as SwatchListing} />
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

export function VerticalListing(props: VerticalListingProps) {

    return (
        <VerticalListingCached {...props} />
    )
}