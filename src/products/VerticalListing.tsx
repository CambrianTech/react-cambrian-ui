import * as React from "react";
import classes from "./VerticalListing.scss";
import {HorizontalListing} from "./HorizontalListing";
import {Thumbnail} from "../general";
import {appendClassName} from "../internal/Utils"
import {DataFilter, DataItem, SwatchItem} from "react-home-ar";
import {ReactNode} from "react";
import {SwatchInfoParams, SwatchListing, SwatchListingProps, SwatchListingState} from "./SwatchListing";

export type VerticalListingProps = SwatchListingProps & {
    selectedSubSwatch?:SwatchItem
    getSubSwatchChildren?:(swatch:SwatchItem, isSelected:boolean)=>ReactNode|null
    getSubSwatchInfo?:(params:SwatchInfoParams)=>ReactNode|null
    willRenderSubSwatches?:(swatches:SwatchItem[])=>void
}

export class VerticalListing extends SwatchListing<VerticalListingProps> {
    protected constructor(props:VerticalListingProps) {
        super(props, "vertical-swatch-listing", classes)
    }

    protected didDataChange(nextProps: Readonly<VerticalListingProps>, nextState: Readonly<SwatchListingState>) {
        return nextProps.selectedSubSwatch != this.props.selectedSubSwatch ||  super.didDataChange(nextProps, nextState)
    }

    protected scrollSwatchIntoView(swatchDiv:HTMLDivElement, prevSwatchDiv?:HTMLDivElement, behavior?:ScrollBehavior) {
        if (swatchDiv && this.listingContent.current && this.listing.current) {
            const swatchRect = swatchDiv.getBoundingClientRect();
            const listingRect = this.listing.current.getBoundingClientRect();
            const contentRect = this.listingContent.current.getBoundingClientRect();
            const subSwatches = document.getElementById(`${swatchDiv.id}-swatches`) as HTMLDivElement;

            if (!subSwatches) return;

            const topOfSwatch = swatchRect.top - contentRect.top;

            let newTop = topOfSwatch - 0.5 * listingRect.height + 0.5 * Math.min(swatchRect.height, listingRect.height);
            let subSwatchesHeight = subSwatches.getBoundingClientRect().height;
            if (!subSwatchesHeight) {
                //issue here is that the subSwatches is closed, so we need to know the height beforehand
                subSwatchesHeight = swatchRect.height
            }

            if (prevSwatchDiv) {
                const prevRect = prevSwatchDiv.getBoundingClientRect();
                if (prevRect.top > swatchRect.top) {
                    const amount = prevRect.height - swatchRect.height;
                    newTop += amount
                }
            } else {
                newTop += subSwatchesHeight / 2.0
            }

            const options:ScrollToOptions = {
                top: newTop
            };

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
        const isPlural = params.swatch.children.length !== 1;
        const childName = params.swatch.childName ? params.swatch.childName(isPlural) : (isPlural ? "Items" : "Item");
        const numColorsText = `${numColors} ${params.isFiltered ? "Matching" : ""} ${childName}`;
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

    private clearSelection() {
        const selectedRow = document.querySelector(".vertical-swatch-listing-item.selected");
        if (selectedRow) {
            selectedRow.classList.remove("selected");
            return selectedRow;
        }
        return undefined;
    }

    private clickedRow(swatch:SwatchItem) {
        const clearedRow = this.clearSelection();
        const row = document.getElementById(swatch.key) as HTMLDivElement;
        const rowChild = document.getElementById(`${swatch.key}-swatches`) as HTMLDivElement;
        if (row && rowChild) {
            if (clearedRow === row) {
                row.classList.remove("selected");
                rowChild.classList.remove("selected");
                rowChild.classList.remove(classes.subSwatchListingContainerSelected)
            } else {
                row.classList.add("selected");
                rowChild.classList.add("selected");
                rowChild.classList.add(classes.subSwatchListingContainerSelected)
            }
        }
        this.props.onClick(swatch)
    }

    protected renderSwatch(swatch:SwatchItem): ReactNode {
        const filters = this.filters;
        const subSwatches = DataFilter.applyFilters(filters, swatch.children as DataItem[]);
        const numSwatches:number|undefined = swatch.children ? subSwatches.length : undefined;

        if (filters.length && numSwatches === 0) {
            return null
        }

        const isChildSelected = swatch.hasColumns && this.props.selectedSwatch === swatch;

        let className = appendClassName("vertical-swatch-listing-item", classes.swatchListingItem);
        let childClassName = appendClassName("vertical-swatch-listing-child", classes.subSwatchListingContainer);
        if (isChildSelected) {
            className = appendClassName(className, "selected");
            childClassName = appendClassName(childClassName, "selected");
            childClassName = appendClassName(childClassName, classes.subSwatchListingContainerSelected);
        }

        const swatchChildElements = this.props.getSwatchChildren ? this.props.getSwatchChildren(swatch, isChildSelected) : null;

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
                     onClick={()=>this.clickedRow(swatch)}>
                    <div className={appendClassName("vertical-swatch-listing-image-container", classes.swatchListingImageContainer)}>
                        <Thumbnail className={appendClassName("vertical-swatch-listing-image", classes.swatchListingImage)} swatch={swatch}
                                   visibilityWillChange={(visible)=>this.thumbnailVisibilityChanged(swatch, visible)}
                                   subSwatches={subSwatches} resolveThumbnailPath={this.props.resolveThumbnailPath} />
                        {swatchChildElements}
                    </div>
                    {this.getSwatchInfo(params)}
                    {params.children}
                </div>

                <div id={`${swatch.key}-swatches`} className={childClassName}>
                    {isChildSelected && subSwatches.length > 0 &&
                    <HorizontalListing
                        selectedSwatch={this.props.selectedSubSwatch}
                        onClick={this.props.onClick}
                        resolveThumbnailPath={this.props.resolveThumbnailPath}
                        swatches={subSwatches}
                        getSwatchChildren={this.props.getSubSwatchChildren}
                        getSwatchInfo={this.props.getSubSwatchInfo}
                        willRenderSwatches={(swatches)=>this.willRenderSubSwatches(swatches)}
                        swatchVisibilityChanged={this.props.swatchVisibilityChanged}
                    />}
                </div>

            </div>
        )
    }
}