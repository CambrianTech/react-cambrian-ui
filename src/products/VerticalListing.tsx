import * as React from "react";
import classes from "./VerticalListing.scss";
import {HorizontalListing} from "./HorizontalListing";
import {Thumbnail} from "../general";
import {appendClassName} from "../internal/Utils"
import {DataFilter, ProductBase, SwatchItem} from "react-home-ar";
import {ReactNode} from "react";
import {SwatchInfoParams, SwatchListing, SwatchListingProps, SwatchListingState} from "./SwatchListing";

export type VerticalListingProps = SwatchListingProps & {
    selectedSubSwatch?:SwatchItem
    getSubSwatchChildren?:(swatch:SwatchItem, isSelected:boolean)=>ReactNode|null
    getSubSwatchInfo?:(params:SwatchInfoParams)=>ReactNode|null
    willRenderSubSwatches?:(swatches:SwatchItem[])=>void
    collapseSelection?:boolean
}

export class VerticalListing extends SwatchListing<VerticalListingProps> {
    protected constructor(props:VerticalListingProps) {
        super(props, "vertical-swatch-listing", classes)
    }

    protected didDataChange(nextProps: Readonly<VerticalListingProps>, nextState: Readonly<SwatchListingState>) {
        return nextProps.selectedSubSwatch != this.props.selectedSubSwatch
            || nextProps.collapseSelection != this.props.collapseSelection
            ||  super.didDataChange(nextProps, nextState)
    }

    protected scrollSwatchIntoView(swatchDiv:HTMLDivElement, prevSwatchDiv?:HTMLDivElement, behavior?:ScrollBehavior) {
        if (swatchDiv && this.listingContent.current && this.listing.current) {
            const swatchRect = swatchDiv.getBoundingClientRect();
            const listingRect = this.listing.current.getBoundingClientRect();
            const contentRect = this.listingContent.current.getBoundingClientRect();

            const topOfSwatch = swatchRect.top - contentRect.top;
            let newTop = topOfSwatch - 0.5 * listingRect.height + 0.5 * Math.min(swatchRect.height, listingRect.height)

            if (prevSwatchDiv) {
                const prevRect = prevSwatchDiv.getBoundingClientRect();
                if (prevRect.top > swatchRect.top) {
                    newTop += prevRect.height - Math.min(swatchRect.height, listingRect.height)
                }
            } else {
                newTop += 0.5 * Math.min(swatchRect.height, listingRect.height)
            }

            // if (listingRect.height < 2.5 * swatchRect.height) {
            //     newTop = topOfSwatch
            //     if (prevSwatchDiv) {
            //         const prevRect = prevSwatchDiv.getBoundingClientRect();
            //         if (prevRect.top > swatchRect.top) {
            //             console.log("HERE")
            //             newTop += prevRect.height - swatchRect.height
            //         }
            //     }
            // }

            const options:ScrollToOptions = {
                top: newTop
            }

            if (behavior) {
                options.behavior = behavior
            }

            this.listing.current.scroll(options);
        }
    }

    protected getSwatchInfo(params:SwatchInfoParams) {
        if (this.props.getSwatchInfo) {
            return this.props.getSwatchInfo(params)
        }
        const numColors = params.childCount ? params.childCount : (params.swatch.numChildren ? params.swatch.numChildren : 0);
        const colorsPlural = `Color${numColors > 1 ? 's' : ''}`;
        const numColorsText = `${numColors} ${params.isFiltered ? "Matching" : ""} ${colorsPlural}`;
        return (
            <div className={appendClassName("vertical-swatch-listing-info", classes.swatchListingInfo)}>
                <div className={appendClassName("vertical-swatch-listing-title", classes.swatchListingTitle)}>{params.swatch.displayName}</div>
                <div className={appendClassName("vertical-swatch-listing-description", classes.swatchListingDescription)}>{params.swatch.description}</div>
                <div className={appendClassName("vertical-swatch-listing-num-colors", classes.swatchListingNumColors)}>{numColorsText}</div>
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

        const filters = this.filters;
        const subSwatches = DataFilter.applyFilters(filters, swatch.children as ProductBase[]);
        const numSwatches:number|undefined = swatch.children ? subSwatches.length : undefined;

        if (numSwatches === 0) {
            return null
        }

        const isChildSelected = swatch.hasColumns && this.props.selectedSwatch === swatch && !this.props.collapseSelection;

        let className = appendClassName("vertical-swatch-listing-item", classes.swatchListingItem);
        let childClassName = appendClassName("vertical-swatch-listing-child", classes.subSwatchListingContainer);
        if (isChildSelected && subSwatches.length > 0) {
            className = appendClassName(className, "selected");
            childClassName = appendClassName(childClassName, classes.subSwatchListingContainerSelected);
            childClassName = appendClassName(childClassName, "selected");
        }

        const swatchChildElements = this.props.getSwatchChildren ? this.props.getSwatchChildren(swatch, isChildSelected) : null;

        if (subSwatches.length === 1 && isChildSelected) {
            this.props.onClick(subSwatches[0])
        }

        const params:SwatchInfoParams = {
            swatch,
            isSelected:isChildSelected,
            isFiltered:!!this.props.filters && this.props.filters.length > 0,
            childCount:subSwatches.length
        };

        if (this.props.willRenderSwatch) {
            this.props.willRenderSwatch(params)
        }

        return (
            <div key={swatch.key} id={swatch.key} className={className}>

                <div className={appendClassName("vertical-swatch-listing-details", classes.swatchListingDetails)}
                     onClick={()=>this.props.onClick(swatch)}>
                    <div className={appendClassName("vertical-swatch-listing-image-container", classes.swatchListingImageContainer)}>
                        <Thumbnail className={appendClassName("vertical-swatch-listing-image", classes.swatchListingImage)} swatch={swatch} subSwatches={subSwatches} resolveThumbnailPath={this.props.resolveThumbnailPath} />
                        {swatchChildElements}
                    </div>
                    {this.getSwatchInfo(params)}
                    {params.children}
                </div>

                <div className={childClassName}>
                    {isChildSelected && subSwatches.length > 0 &&
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