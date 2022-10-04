import React, {createRef, ReactElement} from "react"
import {LazyBase} from "./LazyElement";
import Observer from "@researchgate/react-intersection-observer";
import {FastAverageColor, FastAverageColorResult} from "fast-average-color";

type ImageSource = {
    src?:string
    srcSet?:string
}

const blankImageSrc = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="

export type ImageInfo = FastAverageColorResult & {
    width: number
    height: number
}

type LazyImageProps = {
    className?: string
    src?:string
    srcSet?:string
    alt?:string
    placeholderSrc?:string
    maintainSize?:boolean
    loadOnMount?:boolean
    crossOrigin?:"anonymous" | "use-credentials" | "" | undefined
    getImageSource?:() => ImageSource
    placeholder?:() => ReactElement
    visibilityWillChange?:(visible:boolean)=>void
    imageLoaded?:(info:ImageInfo)=>void
}

export class LazyImage extends LazyBase<LazyImageProps> {

    private _imageElement = createRef<HTMLImageElement>();

    getImageSource() : ImageSource {
        if (this.props.getImageSource) {
            return this.props.getImageSource()
        }
        return {
            src:this.props.src,
            srcSet:this.props.srcSet,
        }
    }

    componentDidMount() {
        super.componentDidMount();

        const element = this._imageElement.current;
        const onload = this.props.imageLoaded;
        if (element && onload) {

            element.onload = () =>{
                const fac = new FastAverageColor();
                const info = fac.getColor(element);
                const size = element.getBoundingClientRect();

                if (this.props.maintainSize) {
                    element.style.width = `${size.width}px`;
                    element.style.height = `${size.height}px`;
                }

                onload({...size, ...info});
            }
        }
    }

    componentWillUnmount() {
        if (this._imageElement.current) {
            this._imageElement.current.src = blankImageSrc
            this._imageElement.current.srcset = blankImageSrc
        }
        super.componentWillUnmount()
    }

    protected get placeholderImageSrc(): string {
        return this.props.placeholderSrc ? this.props.placeholderSrc : blankImageSrc;
    }

    protected visibilityWillChange(visible:boolean):void {

        if (this._imageElement.current) {
            const newSrc = visible ? this.props.src : this.placeholderImageSrc
            if (this.props.src && newSrc && newSrc !== this._imageElement.current.src) {
                this._imageElement.current.src = newSrc
            }
            const newSrcSet = visible ? this.props.srcSet : this.placeholderImageSrc
            if (this.props.srcSet && newSrcSet && newSrcSet !== this._imageElement.current.srcset) {
                this._imageElement.current.srcset = newSrcSet
            }
        }

        if (this.props.visibilityWillChange) {
            this.props.visibilityWillChange(visible)
        }
    }

    render() {
        return <Observer root={this.props.root} rootMargin={this.props.rootMargin} onChange={(event:IntersectionObserverEntry) => this.handleIntersection(event)}>
            <img ref={this._imageElement} className={this.props.className} alt={this.props.alt}
                 crossOrigin={this.props.crossOrigin ? this.props.crossOrigin : "anonymous"}
                 src={this.props.src ? (this.props.loadOnMount ? this.props.src : blankImageSrc) : undefined}
                 srcSet={this.props.srcSet ? (this.props.loadOnMount ? this.props.srcSet : blankImageSrc) : undefined}
            />
        </Observer>
    }
}

