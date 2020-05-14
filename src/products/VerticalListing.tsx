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
                    {cProps.parent.children.map((swatch) => {
                        return (
                            <div key={swatch.key} className={appendClassName("item", classes.verticalListingItem)} onClick={()=>cProps.onRowSelected(swatch)}>
                                <div className={appendClassName("details", classes.verticalListingDetails)}>
                                    <img className={appendClassName("image", classes.verticalListingSwatch)} src={cProps.resolveThumbnailPath(swatch)} alt={swatch.displayName} />
                                    <div className={appendClassName("info", classes.verticalListingInfo)}>
                                        <div className={appendClassName("title", classes.verticalListingTitle)}>{swatch.displayName}</div>
                                        <div className={appendClassName("description", classes.verticalListingDescription)}>{swatch.description}</div>
                                    </div>
                                </div>
                                <HorizontalListing visible={cProps.selectedRow === swatch} resolveThumbnailPath={cProps.resolveThumbnailPath}
                                                   parent={cProps.selectedRow as SwatchListing} />
                            </div>
                        )
                    })}
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