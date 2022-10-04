import * as React from "react";
import classes from "./HorizontalListing.scss";
import {isDarkSwatch, Thumbnail} from "../general";
import {SwatchInfoParams, SwatchListing, SwatchListingProps} from "./SwatchListing";
import {SwatchItem} from "react-home-ar";
import {ReactNode} from "react";
import {appendClassName} from "../internal/Utils";

export type HorizontalListingProps = SwatchListingProps;

export class HorizontalListing extends SwatchListing<HorizontalListingProps> {
    protected constructor(props:HorizontalListingProps) {
        super(props, "horizontal-swatch-listing", classes)

        this.autoScrollTimeout = 500;
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

    protected scrollSwatchIntoView(swatchDiv:HTMLDivElement, prevSwatchDiv?:HTMLDivElement, behavior?:ScrollBehavior) {

        if (swatchDiv && this.content && this.listing) {
            const swatchRect = swatchDiv.getBoundingClientRect();
            const listingRect = this.listing.getBoundingClientRect();
            const contentRect = this.content.getBoundingClientRect();

            const leftOfSwatch = swatchRect.left - contentRect.left;
            let newLeft = leftOfSwatch - 0.5 * listingRect.width + 0.5 * swatchRect.width

            const options:ScrollToOptions = {
                left: newLeft
            }
            if (behavior) {
                options.behavior = behavior
            }
            this.listing.scroll(options);
        }
    }

    protected renderSwatch(swatch:SwatchItem): ReactNode {

        const isSelected = this.props.selectedSwatch === swatch

        let className = appendClassName("horizontal-swatch-listing-item",
            isSelected ? classes.swatchListingItemSelected : classes.swatchListingItem)

        className = appendClassName(className, isDarkSwatch(swatch) ? classes.darkImage : classes.lightImage)

        if (isSelected) {
            className = appendClassName(className, "selected")
        }

        const swatchChildren = this.props.getSwatchChildren ? this.props.getSwatchChildren(swatch, isSelected) : null

        return (
            <div key={swatch.key} id={swatch.key} onClick={()=>this.props.onClick(swatch)} className={className}>
                <div className={appendClassName("horizontal-swatch-listing-details", classes.swatchListingDetails)}>
                    <div className={appendClassName("horizontal-swatch-listing-image-container", classes.swatchListingImageContainer)}>
                        <Thumbnail className={appendClassName("horizontal-swatch-listing-image", classes.swatchListingImage)}
                                   visibilityWillChange={(visible)=>{this.thumbnailVisibilityChanged(swatch, visible)}}
                                   onload={(swatch, info)=>this.swatchLoaded(swatch, classes.darkImage, classes.lightImage, info)}
                                   swatch={swatch}
                                   resolveThumbnailPath={this.props.resolveThumbnailPath} />
                        {this.getSwatchInfo({swatch, isSelected,
                            isFiltered:!!this.props.filters && this.props.filters.length > 0,
                            childCount:swatch.children.length
                        })}
                        {swatchChildren}
                    </div>
                </div>
            </div>
        )
    }
}