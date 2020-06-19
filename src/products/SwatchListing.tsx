import * as React from "react";
import {ProductBase, SwatchItem, DataFilter} from "react-home-ar";
import {appendClassName} from "../internal/Utils";
import {createRef, ReactNode} from "react";

export type SwatchListingProps = {
    className?:string
    swatches?:SwatchItem[]
    selectedSwatch?:SwatchItem
    onClick:(item:SwatchItem)=>void
    resolveThumbnailPath:(swatch:SwatchItem, subSwatches?:SwatchItem[])=>string|undefined
    filters?:DataFilter[]
    applyFilters?:boolean
    getSwatchChildren?:(swatch:SwatchItem, isSelected:boolean)=>ReactNode|null
    getSwatchInfo?:(params:SwatchInfoParams)=>ReactNode|null

    willRenderSwatches?:(swatches:SwatchItem[])=>void
    willRenderSwatch?:(params:SwatchInfoParams)=>void
}

export type SwatchListingState = {
    filterString:string|undefined
}

export type SwatchInfoParams = {
    swatch:SwatchItem,
    isSelected:boolean,
    isFiltered:boolean,
    childCount:number|undefined
    children?:ReactNode|undefined
}

export abstract class SwatchListing<T extends SwatchListingProps> extends React.Component<T,SwatchListingState> {
    protected constructor(props:T, protected listingName:string, protected scss:any) {
        super(props)
        this.state = {
            filterString:undefined,
        }
    }

    protected abstract getSwatchInfo(params:SwatchInfoParams) : ReactNode

    protected abstract renderSwatch(swatch:SwatchItem): ReactNode;

    protected listing = createRef<HTMLDivElement>()
    protected listingContent = createRef<HTMLDivElement>()

    protected get swatches() : SwatchItem[] {
        const swatches = this.props.swatches as ProductBase[]
        return this.props.applyFilters ? DataFilter.applyFilters(this.filters, swatches) : swatches
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

    protected didDataChange(nextProps: Readonly<T>, nextState: Readonly<SwatchListingState>) {
        return nextProps.swatches !== this.props.swatches
    }

    shouldComponentUpdate(nextProps: Readonly<T>, nextState: Readonly<SwatchListingState>): boolean {
        const dataDidChange = this.didDataChange(nextProps, nextState)
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

        if (this.props.willRenderSwatches) {
            this.props.willRenderSwatches(swatches)
        }

        if (swatches.length) {
            const parent = swatches[0].parent
            if (parent instanceof ProductBase) {
                const parentItem = parent as ProductBase
                //todo:handle existing declared onUpdate?
                parentItem.onUpdate = ()=>{
                    this.forceUpdate()
                }
            }
        }

        //console.log(`Rendering ${swatches.length} swatches`)

        return (
            <div ref={this.listing} className={className}>
                <div ref={this.listingContent} className={appendClassName(`${this.listingName}-content`, this.scss.swatchListingContent)}>
                    {swatches.map((swatch) => {
                        return this.renderSwatch(swatch)
                    })}
                </div>
            </div>
        );
    }
}