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
        if (swatchDiv && this.content && this.listing) {
            const listingRect = this.listing.getBoundingClientRect();
            const subSwatches = document.getElementById(`${swatchDiv.id}-swatches`) as HTMLDivElement;

            if (!subSwatches) return;

            let scrollTo = swatchDiv.offsetTop - listingRect.height / 2.0 - subSwatches.getBoundingClientRect().height / 2.0;

            if (prevSwatchDiv && prevSwatchDiv.offsetTop < subSwatches.offsetTop) {
                const prevSwatchRect = prevSwatchDiv.getBoundingClientRect();
                scrollTo -= prevSwatchRect.height / 2.0;
            }

            const options:ScrollToOptions = {
                top: scrollTo
            };

            if (behavior) {
                options.behavior = behavior
            }

            this.listing.scroll(options);
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
        window.setTimeout(()=>{
            if (this.isMounted) this.props.onClick(swatch)
        }, 500);
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