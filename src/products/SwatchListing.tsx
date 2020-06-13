import * as React from "react";
import {ProductBase, SwatchItem, DataFilter} from "react-home-ar";
import {appendClassName} from "../internal/Utils";
import {ReactNode} from "react";

export type SwatchListingProps = {
    className?:string
    swatches?:SwatchItem[]
    selectedSwatch?:SwatchItem
    onClick:(item:SwatchItem)=>void
    resolveThumbnailPath:(swatch:SwatchItem)=>string|undefined
    filters?:DataFilter[]
}

export abstract class SwatchListing<T extends SwatchListingProps> extends React.Component<T,any> {
    protected constructor(props:T, protected listingName:string, protected scss:any) {
        super(props)
    }

    protected abstract renderSwatch(swatch:SwatchItem): ReactNode;

    protected get swatches() : SwatchItem[] {

        if (this.props.swatches) {
            const items = this.props.swatches as ProductBase[]
            if (this.props.filters && this.props.filters.length && items.length) {
                return DataFilter.applyFilters(this.props.filters as DataFilter[], items)
            }
            return items
        }

        return []
    }

    private filtersToString(filters:DataFilter[]) {
        let values:string[] = []
        filters.forEach(filter=>values.push(filter.value))
        return values.join(',')
    }

    private filtersChanged(nextProps: Readonly<T>) {
        if (nextProps.filters !== this.props.filters) return true;
        if (nextProps.filters && this.props.filters) {
            if (nextProps.filters.length !== this.props.filters.length) {
                return true
            }
            return this.filtersToString(nextProps.filters as DataFilter[]) !== this.filtersToString(this.props.filters as DataFilter[])
        }
        return false
    }

    private dataChanged(nextProps: Readonly<T>) {
        return nextProps.swatches !== this.props.swatches
    }

    shouldComponentUpdate(nextProps: Readonly<T>): boolean {
        const dataDidChange = this.dataChanged(nextProps)
        const selectedSwatchChanged = (nextProps.selectedSwatch !== this.props.selectedSwatch);
        const filtersDidChange = this.filtersChanged(nextProps)
        return dataDidChange || selectedSwatchChanged || filtersDidChange
    }

    render() {
        if (!this.props.swatches) {
            return null
        }

        let className = appendClassName(this.listingName, this.scss.swatchListing)
        className = appendClassName(className, this.props.className)

        const swatches = this.swatches

        //console.log(`Rendering ${swatches.length} swatches`)

        return (
            <div className={className}>
                <div className={appendClassName(`${this.listingName}-content`, this.scss.swatchListingContent)}>
                    {swatches.map((swatch) => {
                        return this.renderSwatch(swatch)
                    })}
                </div>
            </div>
        );
    }
}