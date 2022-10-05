import * as React from "react";
import {DataItem, SwatchItem, DataFilter} from "react-home-ar";
import {appendClassName} from "../internal/Utils";
import {createRef, ReactNode} from "react";
import {ImageInfo} from "./LazyImage";
import {isDarkSwatch} from "./Thumbnail";

export type SwatchListingProps = {
    id?:string
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
    didScroll?:(scroller:HTMLDivElement, content:HTMLDivElement, e:any)=>void

    swatchVisibilityChanged?:(swatch:SwatchItem, visible: boolean) => void
    children?:ReactNode
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

    private _listing = createRef<HTMLDivElement>();
    private _content = createRef<HTMLDivElement>();

    public get listing() : HTMLDivElement | null {
        return this._listing.current;
    }

    public get content() : HTMLDivElement | null {
        return this._content.current;
    }

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

    protected get isMounted() : boolean {
        return this._isMounted;
    }

    private scrollInterval = 0;
    private lastAutoScrollTime = 0;
    protected autoScrollTimeout = 2000;
    private _boundEvents = false;
    private _prevSwatchDiv:HTMLDivElement|undefined = undefined;

    private onScroll = (e:any) => {
        if (!this._isMounted) return;

        if (!this._realScroll) {
            this.lastAutoScrollTime = performance.now()
        } else if (this.scrollInterval) {
            window.clearInterval(this.scrollInterval)
        }

        if (this.props.didScroll && this.listing && this.content) {
            this.props.didScroll(this.listing, this.content, e);
        }
    };

    private _realScroll = false;
    private _realScrollPossible = false;
    private onWheel = () => {
        if (!this._isMounted) return;

        if (this._realScrollPossible) {
            this._realScroll = true;
        }
        window.clearInterval(this.scrollInterval)
    };

    protected onMouseover() {
        if (!this._isMounted) return;
        this._realScrollPossible = true
    }

    protected onMouseout() {
        if (!this._isMounted) return;
        this._realScrollPossible = false
    }

    protected onClick() {
        if (!this._isMounted) return;
        if (this.scrollInterval) window.clearInterval(this.scrollInterval)
    }

    protected onTouchstart() {
        if (!this._isMounted) return;
        if (this.scrollInterval) window.clearInterval(this.scrollInterval)
    }

    protected onTouchmove() {
        if (!this._isMounted) return;
        if (this.scrollInterval) window.clearInterval(this.scrollInterval)
    }


    protected bindEvents() {
        if (!this.listing) return;

        this._boundEvents = true;

        this.listing.addEventListener('scroll', this.onScroll);
        this.listing.addEventListener('wheel', this.onWheel);
        this.listing.addEventListener('mouseover', this.onMouseover);
        this.listing.addEventListener('mouseout', this.onMouseout);
        this.listing.addEventListener('click', this.onClick);
        this.listing.addEventListener('touchstart', this.onTouchstart);
        this.listing.addEventListener('touchmove', this.onTouchmove);

        this.scrollInterval = window.setInterval(()=>{
            if (!this.isMounted || !this.props.selectedSwatch || this._realScroll) return;
            const swatchDiv = document.getElementById(this.props.selectedSwatch.key) as HTMLDivElement;
            if (swatchDiv && !this.lastAutoScrollTime || (performance.now() - this.lastAutoScrollTime) > 500) {
                this.scrollSwatchIntoView(swatchDiv, this._prevSwatchDiv, "auto")
            }
        },500);
        window.setTimeout(()=>{
            window.clearInterval(this.scrollInterval); this.scrollInterval = 0
        }, this.autoScrollTimeout)
    }

    private unbindEvents() {
        if (!this.listing) return;

        this._boundEvents = false;

        this.listing.removeEventListener('scroll', this.onScroll);
        this.listing.removeEventListener('wheel', this.onWheel);
        this.listing.removeEventListener('mouseover', this.onMouseover);
        this.listing.removeEventListener('mouseout', this.onMouseout);
        this.listing.removeEventListener('click', this.onClick);
        this.listing.removeEventListener('touchstart', this.onTouchstart);
        this.listing.removeEventListener('touchmove', this.onTouchmove);

        if (this.scrollInterval) {
            window.clearInterval(this.scrollInterval); this.scrollInterval = 0;
        }
    }

    private _isMounted = false;

    componentDidMount() {
        this._isMounted = true;

        if (!this._boundEvents) {
            this.bindEvents();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        if (this._boundEvents) {
            this.unbindEvents();
        }
    }

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

        if (!this.isMounted || !this.props.selectedSwatch || !this.listing || !this.content) return;

        const swatchDiv = document.getElementById(this.props.selectedSwatch.key) as HTMLDivElement;
        this._prevSwatchDiv = prevProps.selectedSwatch ? document.getElementById(prevProps.selectedSwatch.key) as HTMLDivElement : undefined;

        if (swatchDiv && prevProps.selectedSwatch !== this.props.selectedSwatch) {
            //console.log(`Swatch changed from '${prevProps.selectedSwatch ? prevProps.selectedSwatch.displayName:""}' to '${this.props.selectedSwatch.displayName}'`);
            this.scrollSwatchIntoView(swatchDiv, this._prevSwatchDiv, "smooth")
        }
    }

    protected swatchLoaded(swatch:SwatchItem, darkClass:string, lightClass:string, info?:ImageInfo) {
        const swatchElement = document.getElementById(swatch.key);
        if (!swatchElement) return

        swatchElement.classList.remove(darkClass);
        swatchElement.classList.remove(lightClass);
        swatchElement.classList.add(isDarkSwatch(swatch) ? darkClass : lightClass);
    }

    render() {
        if (!this.props.swatches || this.props.visible === false) {
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
                parentItem.fetch();
                parentItem.onUpdate = ()=>{
                    if (this.isMounted) this.forceUpdate();
                }
            }
        }

        let swatchCount = 0;
        const filterCount = this.props.applyFilters && this.props.filters ? this.props.filters.length : -1;

        return (
            <div ref={this._listing} id={this.props.id} className={className}>
                <div ref={this._content} className={appendClassName(`${this.listingName}-content`, this.scss.swatchListingContent)}>
                    {swatches.map((swatch) => {
                        const result = this.renderSwatch(swatch);
                        if (result) swatchCount ++;
                        return result
                    })}
                </div>
                {swatchCount === 0 && filterCount === 0 && this.props.children}
            </div>
        );
    }
}