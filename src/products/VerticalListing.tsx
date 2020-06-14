import * as React from "react";
import classes from "./VerticalListing.scss";
import {HorizontalListing} from "./HorizontalListing";
import {Thumbnail} from "../general";
import {appendClassName} from "../internal/Utils"
import {SwatchItem} from "react-home-ar";
import {ReactNode} from "react";
import {SwatchListing, SwatchListingProps} from "./SwatchListing";

export type VerticalListingProps = SwatchListingProps & {
    selectedSubSwatch?:SwatchItem
}

export class VerticalListing extends SwatchListing<VerticalListingProps> {
    protected constructor(props:VerticalListingProps) {
        super(props, "vertical-swatch-listing", classes)
    }

    shouldComponentUpdate(nextProps: Readonly<VerticalListingProps>): boolean {
        const shouldUpdate = super.shouldComponentUpdate(nextProps) || nextProps.selectedSubSwatch != this.props.selectedSubSwatch
        //console.log(`Should update? ${shouldUpdate}`)
        return shouldUpdate
    }

    protected renderSwatch(swatch:SwatchItem): ReactNode {
        return (
            <div key={swatch.key} className={appendClassName("vertical-swatch-listing-item", classes.swatchListingItem)}>
                <div onClick={()=>this.props.onClick(swatch)}
                     className={appendClassName("vertical-swatch-listing-details", classes.swatchListingDetails)}>

                    <Thumbnail className={appendClassName("vertical-swatch-listing-image", classes.swatchListingImage)} swatch={swatch} resolveThumbnailPath={this.props.resolveThumbnailPath} />

                    <div className={appendClassName("vertical-swatch-listing-info", classes.swatchListingInfo)}>
                        <div className={appendClassName("vertical-swatch-listing-title", classes.swatchListingTitle)}>{swatch.displayName}</div>
                        <div className={appendClassName("vertical-swatch-listing-description", classes.swatchListingDescription)}>{swatch.description}</div>
                        <div className={appendClassName("vertical-swatch-listing-secondary-description", classes.swatchListingSecondaryDescription)}>{swatch.secondaryDescription}</div>
                    </div>

                </div>

                {swatch.hasColumns && this.props.selectedSwatch === swatch &&
                <HorizontalListing
                    selectedSwatch={this.props.selectedSubSwatch}
                    onClick={this.props.onClick}
                    resolveThumbnailPath={this.props.resolveThumbnailPath}
                    swatches={swatch.children} />}

            </div>
        )
    }
}