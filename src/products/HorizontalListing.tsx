import * as React from "react";
import classes from "./HorizontalListing.scss";
import {Thumbnail} from "../general";
import {SwatchListing, SwatchListingProps} from "./SwatchListing";
import {SwatchItem} from "react-home-ar";
import {ReactNode} from "react";
import {appendClassName} from "../internal/Utils";

export type HorizontalListingProps = SwatchListingProps & {

}

export class HorizontalListing extends SwatchListing<HorizontalListingProps> {
    protected constructor(props:HorizontalListingProps) {
        super(props, "horizontal-swatch-listing", classes)
    }

    private getSwatchInfo(swatch:SwatchItem, isSelected:boolean) {
        if (this.props.getSwatchInfo) {
            return this.props.getSwatchInfo(swatch, isSelected)
        }
        return (
            <div className={appendClassName("horizontal-swatch-listing-info", classes.swatchListingInfo)}>
                {swatch.displayName}
            </div>
        )
    }

    protected renderSwatch(swatch:SwatchItem): ReactNode {

        const isSelected = this.props.selectedSwatch === swatch

        let className = appendClassName("horizontal-swatch-listing-item",
            isSelected ? classes.swatchListingItemSelected : classes.swatchListingItem)

        if (isSelected) {
            className = appendClassName(className, "selected")
        }

        const swatchChildren = this.props.getSwatchChildren ? this.props.getSwatchChildren(swatch, isSelected) : null

        return (
            <div key={swatch.key} onClick={()=>this.props.onClick(swatch)} className={className}>
                <div className={appendClassName("horizontal-swatch-listing-details", classes.swatchListingDetails)}>
                    <div className={appendClassName("horizontal-swatch-listing-image-container", classes.swatchListingImageContainer)}>
                        <Thumbnail className={appendClassName("horizontal-swatch-listing-image", classes.swatchListingImage)}
                                   swatch={swatch} resolveThumbnailPath={this.props.resolveThumbnailPath} />
                        {swatchChildren}
                    </div>
                    {this.getSwatchInfo(swatch, isSelected)}
                </div>
            </div>
        )
    }
}