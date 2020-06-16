import * as React from "react";
import classes from "./VerticalListing.scss";
import {HorizontalListing} from "./HorizontalListing";
import {Thumbnail} from "../general";
import {appendClassName} from "../internal/Utils"
import {SwatchItem} from "react-home-ar";
import {ReactNode} from "react";
import {SwatchListing, SwatchListingProps, SwatchListingState} from "./SwatchListing";

export type VerticalListingProps = SwatchListingProps & {
    selectedSubSwatch?:SwatchItem
    getSubSwatchChildren?:(swatch:SwatchItem, isSelected:boolean)=>ReactNode|null
    getSubSwatchInfo?:(swatch:SwatchItem, isSelected:boolean)=>ReactNode|null
}

export class VerticalListing extends SwatchListing<VerticalListingProps> {
    protected constructor(props:VerticalListingProps) {
        super(props, "vertical-swatch-listing", classes)
    }

    protected dataChanged(nextProps: Readonly<VerticalListingProps>) {

        return nextProps.selectedSubSwatch != this.props.selectedSubSwatch || super.dataChanged(nextProps)
    }

    componentDidUpdate(prevProps: Readonly<SwatchListingProps & { selectedSubSwatch?: SwatchItem }>, prevState: Readonly<SwatchListingState>, snapshot?: any): void {
        super.componentDidUpdate(prevProps, prevState, snapshot);
        console.log("Vertical listing updated")
    }

    private getSwatchInfo(swatch:SwatchItem, isSelected:boolean) {
        if (this.props.getSwatchInfo) {
            return this.props.getSwatchInfo(swatch, isSelected)
        }
        return (
            <div className={appendClassName("vertical-swatch-listing-info", classes.swatchListingInfo)}>
                <div className={appendClassName("vertical-swatch-listing-title", classes.swatchListingTitle)}>{swatch.displayName}</div>
                <div className={appendClassName("vertical-swatch-listing-description", classes.swatchListingDescription)}>{swatch.description}</div>
                <div className={appendClassName("vertical-swatch-listing-secondary-description", classes.swatchListingSecondaryDescription)}>{swatch.secondaryDescription}</div>
            </div>
        )
    }

    protected renderSwatch(swatch:SwatchItem): ReactNode {
        const isChildSelected = swatch.hasColumns && this.props.selectedSwatch === swatch
        let childClassName = appendClassName("vertical-swatch-listing-child", classes.subSwatchListingContainer)
        if (isChildSelected) {
            childClassName = appendClassName(childClassName, classes.subSwatchListingContainerSelected)
            childClassName = appendClassName(childClassName, "selected")
        }

        const swatchChildren = this.props.getSwatchChildren ? this.props.getSwatchChildren(swatch, isChildSelected) : null

        return (
            <div key={swatch.key} className={appendClassName("vertical-swatch-listing-item", classes.swatchListingItem)}>
                <div onClick={()=>this.props.onClick(swatch)}
                     className={appendClassName("vertical-swatch-listing-details", classes.swatchListingDetails)}>
                    <div className={appendClassName("vertical-swatch-listing-image-container", classes.swatchListingImageContainer)}>
                        <Thumbnail className={appendClassName("vertical-swatch-listing-image", classes.swatchListingImage)} swatch={swatch} resolveThumbnailPath={this.props.resolveThumbnailPath} />
                        {swatchChildren}
                    </div>
                    {this.getSwatchInfo(swatch,isChildSelected)}
                </div>

                <div className={childClassName}>
                    {isChildSelected &&
                    <HorizontalListing
                        selectedSwatch={this.props.selectedSubSwatch}
                        onClick={this.props.onClick}
                        resolveThumbnailPath={this.props.resolveThumbnailPath}
                        swatches={swatch.children}
                        getSwatchChildren={this.props.getSubSwatchChildren}
                        getSwatchInfo={this.props.getSubSwatchInfo}
                    />}
                </div>

            </div>
        )
    }
}