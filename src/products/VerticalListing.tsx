import * as React from "react";
import classes from "./VerticalListing.scss";
import {HorizontalListing} from "./HorizontalListing";
import {SwatchItem} from "../data";
import {Thumbnail} from "../visualizer/Thumbnail";

type VerticalListingProps = {
    visible: boolean,
    className?:string
    rows?:SwatchItem[]
    selectedRow?:SwatchItem
    selectedColumn?:SwatchItem
    onClick:(item:SwatchItem)=>void
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
        if (cProps.visible && cProps.rows) {
            let className = appendClassName("vertical-swatch-listing", classes.verticalListing)
            className = appendClassName(className, cProps.className)

            return (
                <div className={className}>
                    <div className={appendClassName("vertical-swatch-listing-content", classes.verticalListingContent)}>
                        {cProps.rows.map((swatch) => {
                            return (
                                <div key={swatch.key} className={appendClassName("vertical-swatch-listing-item", classes.verticalListingItem)}>
                                    <div onClick={()=>cProps.onClick(swatch)}
                                         className={appendClassName("vertical-swatch-listing-details", classes.verticalListingDetails)}>

                                        <Thumbnail className={appendClassName("vertical-swatch-listing-image", classes.verticalListingImage)} swatch={swatch} resolveThumbnailPath={cProps.resolveThumbnailPath} />

                                        <div className={appendClassName("vertical-swatch-listing-info", classes.verticalListingInfo)}>
                                            <div className={appendClassName("vertical-swatch-listing-title", classes.verticalListingTitle)}>{swatch.displayName}</div>
                                            <div className={appendClassName("vertical-swatch-listing-description", classes.verticalListingDescription)}>{swatch.description}</div>
                                        </div>

                                    </div>
                                    <HorizontalListing visible={swatch.hasColumns && cProps.selectedRow === swatch}
                                                       selectedSwatch={cProps.selectedColumn}
                                                       onClick={cProps.onClick}
                                                       resolveThumbnailPath={cProps.resolveThumbnailPath}
                                                       columns={swatch.children} />
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