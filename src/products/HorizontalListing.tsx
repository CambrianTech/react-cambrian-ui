import * as React from "react";
import classes from "./HorizontalListing.scss";
import {Thumbnail} from "../general";
import {SwatchInfoParams, SwatchListing, SwatchListingProps, SwatchListingState} from "./SwatchListing";
import {SwatchItem} from "react-home-ar";
import {ReactNode} from "react";
import {appendClassName} from "../internal/Utils";

export type HorizontalListingProps = SwatchListingProps & {

}

export class HorizontalListing extends SwatchListing<HorizontalListingProps> {
    protected constructor(props:HorizontalListingProps) {
        super(props, "horizontal-swatch-listing", classes)
    }

    protected getSwatchInfo(params:SwatchInfoParams) {
        if (this.props.getSwatchInfo) {
            return this.props.getSwatchInfo(params)
        }
        return (
            <div className={appendClassName("horizontal-swatch-listing-info", classes.swatchListingInfo)}>
                {params.swatch.displayName}
            </div>
        )
    }

    protected scrollSwatchIntoView(swatch:SwatchItem, behavior?:ScrollBehavior, prevSwatch?:SwatchItem) {

        const swatchDiv = document.getElementById(swatch.key) as HTMLDivElement;
        if (swatchDiv && this.listingContent.current && this.listing.current) {
            const swatchRect = swatchDiv.getBoundingClientRect();
            const listingRect = this.listing.current.getBoundingClientRect();
            const contentRect = this.listingContent.current.getBoundingClientRect();

            const leftOfSwatch = swatchRect.left - contentRect.left;
            let newLeft = leftOfSwatch - 0.5 * listingRect.width + 0.5 * swatchRect.width

            const options:ScrollToOptions = {
                left: newLeft
            }
            if (behavior) {
                options.behavior = behavior
            }
            this.listing.current.scroll(options);
        }
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
            <div key={swatch.key} id={swatch.key} onClick={()=>this.props.onClick(swatch)} className={className}>
                <div className={appendClassName("horizontal-swatch-listing-details", classes.swatchListingDetails)}>
                    <div className={appendClassName("horizontal-swatch-listing-image-container", classes.swatchListingImageContainer)}>
                        <Thumbnail className={appendClassName("horizontal-swatch-listing-image", classes.swatchListingImage)}
                                   swatch={swatch} resolveThumbnailPath={this.props.resolveThumbnailPath} />
                        {swatchChildren}
                    </div>
                    {this.getSwatchInfo({swatch, isSelected,
                        isFiltered:!!this.props.filters && this.props.filters.length > 0,
                        childCount:swatch.children.length
                    })}
                </div>
            </div>
        )
    }
}