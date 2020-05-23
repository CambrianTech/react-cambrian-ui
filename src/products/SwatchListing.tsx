import * as React from "react";
import {CBARAssetType, SwatchItem} from "react-home-ar";
import {appendClassName} from "../internal/Utils";
import {ReactNode} from "react";

export type SwatchListingProps = {
    className?:string
    swatches?:SwatchItem[]
    selectedSwatch?:SwatchItem
    onClick:(item:SwatchItem)=>void
    resolveThumbnailPath:(swatch:SwatchItem)=>string|undefined
    filters?:SwatchListingFilter[]
}

export type SwatchListingFilter = {
    assetType:CBARAssetType
}

export abstract class SwatchListing<T extends SwatchListingProps> extends React.Component<T> {
    protected constructor(props:T, protected listingName:string, protected scss:any) {
        super(props)
    }

    protected abstract renderSwatch(swatch:SwatchItem): ReactNode;

    render() {
        if (!this.props.swatches) {
            return null
        }

        let className = appendClassName(this.listingName, this.scss.swatchListing)
        className = appendClassName(className, this.props.className)

        return (
            <div className={className}>
                <div className={appendClassName(`${this.listingName}-content`, this.scss.swatchListingContent)}>
                    {this.props.swatches.map((swatch) => {
                        return this.renderSwatch(swatch)
                    })}
                </div>
            </div>
        );
    }
}