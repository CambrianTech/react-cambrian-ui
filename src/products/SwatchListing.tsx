import * as React from "react";
import {DataItem, SwatchItem, DataFilter} from "react-home-ar";
import {appendClassName} from "../internal/Utils";
import {createRef, ReactNode} from "react";

export type SwatchListingProps = {
    visible?:boolean
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

    noResultsNode?:ReactNode|undefined
    swatchVisibilityChanged?:(swatch:SwatchItem, visible: boolean) => void;
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
        super(props);
        this.state = {
            filterString:undefined,
        }
    }

    protected abstract getSwatchInfo(params:SwatchInfoParams) : ReactNode

    protected abstract renderSwatch(swatch:SwatchItem): ReactNode;

    protected abstract scrollSwatchIntoView(swatchDiv:HTMLDivElement, prevSwatchDiv?:HTMLDivElement, behavior?:ScrollBehavior) : void;

    protected listing = createRef<HTMLDivElement>();
    protected listingContent = createRef<HTMLDivElement>();

    protected get swatches() : SwatchItem[] {
        const swatches = this.props.swatches as DataItem[];
        return this.props.applyFilters ? DataFilter.applyFilters(this.filters, swatches) : swatches
    }

    protected get filters() : DataFilter[] {
        return this.props.filters ? this.props.filters as DataFilter[] : []
    }

    private filtersToString(filters:DataFilter[]) {
        let values:string[] = [];
        filters.forEach(filter=>values.push(filter.value));
        return values.join(',')
    }

    private filtersChanged(nextProps: Readonly<SwatchListingProps>) {
        if (nextProps.filters && this.props.filters) {
            if (nextProps.filters.length !== this.props.filters.length) {
                return true
            }
            const nextValue = this.filtersToString(nextProps.filters);
            return nextValue !== this.state.filterString
        }
        //check each are defined
        return !nextProps.filters === !this.props.filters
    }

    protected didDataChange(nextProps: Readonly<T>, nextState: Readonly<SwatchListingState>) {
        return nextProps.swatches !== this.props.swatches || nextProps.visible !== this.props.visible
    }

    protected thumbnailVisibilityChanged(swatch:SwatchItem, visible:boolean) {
        if (this.props.swatchVisibilityChanged) {
            this.props.swatchVisibilityChanged(swatch, visible)
        }
    }

    shouldComponentUpdate(nextProps: Readonly<T>, nextState: Readonly<SwatchListingState>): boolean {
        const dataDidChange = this.didDataChange(nextProps, nextState);
        const selectedSwatchChanged = (nextProps.selectedSwatch !== this.props.selectedSwatch);
        const filtersDidChange = this.filtersChanged(nextProps);

        return dataDidChange || selectedSwatchChanged || filtersDidChange
    }

    private _swatchLengthChanged = false;

    private get isBound() : boolean {
        return !!this.listingContent.current && !!this.listing.current
    }

    private scrollInterval = 0;
    private lastAutoScrollTime = 0;
    protected autoScrollTimeout = 2000;

    private _addedOnScroll = false;
    private onScroll = (e:any) => {
        if (!this._realScroll) {
            this.lastAutoScrollTime = performance.now()
        } else if (this.scrollInterval) {
            window.clearInterval(this.scrollInterval)
        }
    };

    private _realScroll = false;
    private _realScrollPossible = false;
    private onWheel = () => {
        if (this._realScrollPossible) {
            this._realScroll = true;
        }
        window.clearInterval(this.scrollInterval)
    };

    componentDidUpdate(prevProps: Readonly<T>, prevState: Readonly<SwatchListingState>, snapshot?: any): void {
        const filterString = this.filtersToString(this.filters);
        if (filterString !== this.state.filterString) {
            this.setState({
                filterString:filterString,
            })
        }

        const swatchLengthChanged = this.props.swatches && (this.props.swatches !== prevProps.swatches || (prevProps.swatches && this.props.swatches.length != prevProps.swatches.length));

        if (swatchLengthChanged) {
            this._swatchLengthChanged = true
        }

        if (!this.isBound || !this.props.selectedSwatch || !this.listing.current || !this.listingContent.current) return;

        const swatchDiv = document.getElementById(this.props.selectedSwatch.key) as HTMLDivElement;

        if (!swatchDiv) return;

        const prevSwatchDiv = prevProps.selectedSwatch ? document.getElementById(prevProps.selectedSwatch.key) as HTMLDivElement : undefined;

        if (!this._addedOnScroll) {
            this._addedOnScroll = true;
            this.listing.current.addEventListener('scroll', this.onScroll);
            this.listing.current.addEventListener('wheel', this.onWheel);
            this.listing.current.addEventListener('mouseover', ()=>{
                this._realScrollPossible = true
            });
            this.listing.current.addEventListener('mouseout', ()=>{
                this._realScrollPossible = false
            });

            this.listing.current.addEventListener('click', ()=>{
                if (this.scrollInterval) window.clearInterval(this.scrollInterval)
            });

            this.listing.current.addEventListener('touchstart', ()=>{
                if (this.scrollInterval) window.clearInterval(this.scrollInterval)
            });

            this.listing.current.addEventListener('touchmove', ()=>{
                if (this.scrollInterval) window.clearInterval(this.scrollInterval)
            });

            if (!this.scrollInterval && !this._realScroll) {
                this.scrollInterval = window.setInterval(()=>{
                    if (!this.lastAutoScrollTime || (performance.now() - this.lastAutoScrollTime) > 500) {
                        this.scrollSwatchIntoView(swatchDiv, prevSwatchDiv, "smooth")
                    }
                },200);
                window.setTimeout(()=>{
                    window.clearInterval(this.scrollInterval)
                }, this.autoScrollTimeout)
            }
        }

        if (prevProps.selectedSwatch !== this.props.selectedSwatch) {

            //console.log(`Swatch changed from '${prevProps.selectedSwatch ? prevProps.selectedSwatch.displayName:""}' to '${this.props.selectedSwatch.displayName}'`);
            this.scrollSwatchIntoView(swatchDiv, prevSwatchDiv, "smooth")
        }
    }

    render() {
        if (!this.props.swatches || this.props.visible===false) {
            return null
        }

        let className = appendClassName(this.listingName, this.scss.swatchListing);
        className = appendClassName(className, this.props.className);

        const swatches = this.swatches;

        if (this.props.willRenderSwatches) {
            this.props.willRenderSwatches(swatches)
        }

        if (swatches.length) {
            const parent = swatches[0].parent;
            if (parent instanceof DataItem) {
                const parentItem = parent as DataItem;
                //todo:handle existing declared onUpdate?
                parentItem.onUpdate = ()=>{
                    this.forceUpdate();
                }
            }
        }

        let swatchCount = 0;

        return (
            <div ref={this.listing} className={className}>
                <div ref={this.listingContent} className={appendClassName(`${this.listingName}-content`, this.scss.swatchListingContent)}>
                    {swatches.map((swatch) => {
                        const result = this.renderSwatch(swatch);
                        if (result) swatchCount ++;
                        return result
                    })}
                </div>
                {swatchCount === 0 && !!this.props.filters && this.props.filters.length > 0 && this.props.noResultsNode}
            </div>
        );
    }
}