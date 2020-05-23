import * as React from "react";
import classes from "./HorizontalListing.scss";
import {Thumbnail} from "../general";
import {SwatchListing, SwatchListingProps} from "./SwatchListing";
import {SwatchItem} from "react-home-ar";
import {ReactNode} from "react";
import {appendClassName} from "../internal/Utils";

export type HorizontalListingProps = SwatchListingProps

export class HorizontalListing extends SwatchListing<HorizontalListingProps> {
    protected constructor(props:HorizontalListingProps) {
        super(props, "horizontal-swatch-listing", classes)
    }

    protected renderSwatch(swatch:SwatchItem): ReactNode {
        let className = appendClassName("horizontal-swatch-listing-item",
            this.props.selectedSwatch === swatch ? classes.swatchListingItemSelected : classes.swatchListingItem)

        if (this.props.selectedSwatch === swatch) {
            className = appendClassName(className, "selected")
        }

        return (
            <div key={swatch.key} onClick={()=>this.props.onClick(swatch)} className={className}>
                <div className={appendClassName("horizontal-swatch-listing-details", classes.swatchListingDetails)}>
                    <Thumbnail className={appendClassName("horizontal-swatch-listing-image", classes.swatchListingImage)} swatch={swatch} resolveThumbnailPath={this.props.resolveThumbnailPath} />
                    <div className={appendClassName("horizontal-swatch-listing-info", classes.swatchListingInfo)}>
                        {swatch.displayName}
                    </div>
                </div>
            </div>
        )
    }
}