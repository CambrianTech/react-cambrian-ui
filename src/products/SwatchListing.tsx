import * as React from "react";
import {CBARAssetType, ProductBase, SwatchItem} from "react-home-ar";
import {appendClassName} from "../internal/Utils";
import {ReactNode} from "react";

export interface SwatchListingProps {
    className?:string
    swatches?:SwatchItem[]
    selectedSwatch?:SwatchItem
    onClick:(item:SwatchItem)=>void
    resolveThumbnailPath:(swatch:SwatchItem)=>string|undefined
    filters?:SwatchListingFilter[]
}

export interface SwatchListingFilter {
    assetType?:CBARAssetType
}

export abstract class SwatchListing<T extends SwatchListingProps> extends React.Component<T> {
    protected constructor(props:T, protected listingName:string, protected scss:any) {
        super(props)
    }

    protected abstract renderSwatch(swatch:SwatchItem): ReactNode;

    protected matchesFilter(swatch:SwatchItem, filter:SwatchListingFilter) : boolean {
        const product = swatch as ProductBase
        if (filter.assetType && product) {
            return product.assetTypes.indexOf(filter.assetType) >= 0
        }
        return true
    }

    protected get swatches() : SwatchItem[] {

        if (this.props.swatches) {
            let swatches:SwatchItem[] = this.props.swatches as SwatchItem[]

            if (this.props.filters) {
                this.props.filters.forEach(filter => {
                    swatches = swatches.filter((swatch)=>{
                        return this.matchesFilter(swatch, filter)
                    })
                })
            }

            return swatches
        }

        return []
    }

    private filtersChanged(nextProps: Readonly<T>) {
        if (nextProps.filters !== this.props.filters) return true
        if (nextProps.filters && this.props.filters) {
            if (nextProps.filters.length !== this.props.filters.length) {
                return true
            }
            return JSON.stringify(nextProps.filters) !== JSON.stringify(this.props.filters)
        }
        return false
    }

    // shouldComponentUpdate(nextProps: Readonly<T>, nextState: Readonly<{}>, nextContext: any): boolean {
    //     const selectedSwatchChanged = nextProps.selectedSwatch !== this.props.selectedSwatch
    //     return selectedSwatchChanged || this.filtersChanged(nextProps)
    // }

    render() {
        if (!this.props.swatches) {
            return null
        }

        let className = appendClassName(this.listingName, this.scss.swatchListing)
        className = appendClassName(className, this.props.className)

        return (
            <div className={className}>
                <div className={appendClassName(`${this.listingName}-content`, this.scss.swatchListingContent)}>
                    {this.swatches.map((swatch) => {
                        return this.renderSwatch(swatch)
                    })}
                </div>
            </div>
        );
    }
}