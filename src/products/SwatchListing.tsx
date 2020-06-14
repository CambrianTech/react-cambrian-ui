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

export type SwatchListingState = {
    filterString:string|undefined
}

export abstract class SwatchListing<T extends SwatchListingProps> extends React.Component<T,SwatchListingState> {
    protected constructor(props:T, protected listingName:string, protected scss:any) {
        super(props)
        this.state = {
            filterString:undefined,
        }
    }

    protected abstract renderSwatch(swatch:SwatchItem): ReactNode;

    protected get swatches() : SwatchItem[] {
        return DataFilter.applyFilters(this.filters, this.props.swatches as ProductBase[])
    }

    protected get filters() : DataFilter[] {
        return this.props.filters ? this.props.filters as DataFilter[] : []
    }

    private filtersToString(filters:DataFilter[]) {
        let values:string[] = []
        filters.forEach(filter=>values.push(filter.value))
        return values.join(',')
    }

    private filtersChanged(nextProps: Readonly<SwatchListingProps>) {
        if (nextProps.filters && this.props.filters) {
            if (nextProps.filters.length !== this.props.filters.length) {
                return true
            }
            const nextValue = this.filtersToString(nextProps.filters)
            return nextValue !== this.state.filterString
        }
        //check each are defined
        return !nextProps.filters === !this.props.filters
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

    componentDidUpdate(prevProps: Readonly<T>, prevState: Readonly<SwatchListingState>, snapshot?: any): void {
        const filterString = this.filtersToString(this.filters)
        if (filterString !== this.state.filterString) {
            this.setState({
                filterString:filterString,
            })
        }
    }

    render() {
        if (!this.props.swatches) {
            return null
        }

        let className = appendClassName(this.listingName, this.scss.swatchListing)
        className = appendClassName(className, this.props.className)

        const swatches = this.swatches

        console.log(`Rendering ${swatches.length} swatches`)

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