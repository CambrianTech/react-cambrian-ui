import * as React from "react";
import classes from "./VerticalListing.scss";
import {HorizontalListing} from "./HorizontalListing";
import {Thumbnail} from "../general";
import {appendClassName} from "../internal/Utils"
import {DataFilter, Product, ProductBase, SwatchItem} from "react-home-ar";
import {ReactNode} from "react";
import {SwatchListing, SwatchListingProps, SwatchListingState} from "./SwatchListing";

export type VerticalListingProps = SwatchListingProps & {
    selectedSubSwatch?:SwatchItem
    getSubSwatchChildren?:(swatch:SwatchItem, isSelected:boolean)=>ReactNode|null
    getSubSwatchInfo?:(swatch:SwatchItem, isSelected:boolean)=>ReactNode|null
    willRenderSubSwatches?:(swatches:SwatchItem[])=>void
}

export class VerticalListing extends SwatchListing<VerticalListingProps> {
    protected constructor(props:VerticalListingProps) {
        super(props, "vertical-swatch-listing", classes)
    }

    protected didDataChange(nextProps: Readonly<VerticalListingProps>, nextState: Readonly<SwatchListingState>) {
        return nextProps.selectedSubSwatch != this.props.selectedSubSwatch || super.didDataChange(nextProps, nextState)
    }

    componentDidUpdate(prevProps: Readonly<VerticalListingProps>, prevState: Readonly<SwatchListingState>, snapshot?: any): void {
        super.componentDidUpdate(prevProps, prevState, snapshot);
        console.log("Vertical listing updated")
    }

    protected getSwatchInfo(swatch:SwatchItem, isSelected:boolean, childCount:number|undefined) {
        if (this.props.getSwatchInfo) {
            return this.props.getSwatchInfo(swatch, isSelected, childCount)
        }
        const numColors = childCount ? childCount : (swatch.numChildren ? swatch.numChildren : 0)
        return (
            <div className={appendClassName("vertical-swatch-listing-info", classes.swatchListingInfo)}>
                <div className={appendClassName("vertical-swatch-listing-title", classes.swatchListingTitle)}>{swatch.displayName}</div>
                <div className={appendClassName("vertical-swatch-listing-description", classes.swatchListingDescription)}>{swatch.description}</div>
                <div className={appendClassName("vertical-swatch-listing-secondary-description", classes.swatchListingSecondaryDescription)}>{`${numColors} Color${numColors > 1 ? 's' : ''}`}</div>
            </div>
        )
    }

    private willRenderSubSwatches(swatches:SwatchItem[]) {
        if (swatches.length && this.props.willRenderSubSwatches) {
            if (this.props.willRenderSubSwatches) {
                this.props.willRenderSubSwatches(swatches)
            }
        }
    }

    protected renderSwatch(swatch:SwatchItem): ReactNode {

        const subSwatches = DataFilter.applyFilters(this.filters, swatch.children as ProductBase[])
        const numSwatches:number|undefined = swatch.children ? subSwatches.length : undefined

        if (numSwatches === 0) {
            return null
        }

        const isChildSelected = swatch.hasColumns && this.props.selectedSwatch === swatch
        let childClassName = appendClassName("vertical-swatch-listing-child", classes.subSwatchListingContainer)
        if (isChildSelected && subSwatches.length !== 1) {
            childClassName = appendClassName(childClassName, classes.subSwatchListingContainerSelected)
            childClassName = appendClassName(childClassName, "selected")
        }

        const swatchChildElements = this.props.getSwatchChildren ? this.props.getSwatchChildren(swatch, isChildSelected) : null

        if (subSwatches.length === 1 && isChildSelected) {
            this.props.onClick(subSwatches[0])
        }

        return (
            <div key={swatch.key} className={appendClassName("vertical-swatch-listing-item", classes.swatchListingItem)}>
                <div onClick={()=>this.props.onClick(swatch)}
                     className={appendClassName("vertical-swatch-listing-details", classes.swatchListingDetails)}>
                    <div className={appendClassName("vertical-swatch-listing-image-container", classes.swatchListingImageContainer)}>
                        <Thumbnail className={appendClassName("vertical-swatch-listing-image", classes.swatchListingImage)} swatch={swatch} subSwatches={subSwatches} resolveThumbnailPath={this.props.resolveThumbnailPath} />
                        {swatchChildElements}
                    </div>
                    {this.getSwatchInfo(swatch,isChildSelected, numSwatches)}
                </div>

                <div className={childClassName}>
                    {isChildSelected && subSwatches.length !== 1 &&
                    <HorizontalListing
                        selectedSwatch={this.props.selectedSubSwatch}
                        onClick={this.props.onClick}
                        resolveThumbnailPath={this.props.resolveThumbnailPath}
                        swatches={subSwatches}
                        getSwatchChildren={this.props.getSubSwatchChildren}
                        getSwatchInfo={this.props.getSubSwatchInfo}
                        willRenderSwatches={(swatches)=>this.willRenderSubSwatches(swatches)}
                    />}
                </div>

            </div>
        )
    }
}