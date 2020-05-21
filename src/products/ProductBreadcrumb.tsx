import {default as React, useEffect, useState} from "react";
import {SwatchItem} from "../data";
import classes from "./ProductBreadcrumb.scss";

type ProductBreadcrumbProps = {
    firstElement?:React.ReactElement<HTMLElement>
    currentItem?:SwatchItem,
    onClick:(item:SwatchItem)=>void
}

type ProductBreadcrumbListingProps = ProductBreadcrumbProps & {
    swatches:SwatchItem[]
}

const ProductBreadcrumbListing = React.memo<ProductBreadcrumbListingProps>(
    (cProps) => {
        return <div className={classes.productBreadcrumb}>
            {cProps.currentItem && cProps.firstElement}
            {cProps.swatches.map((swatch) => {
                return <button key={swatch.key} onClick={()=>cProps.onClick(swatch)}> {swatch.displayName} </button>
            })}
        </div>
    }, (prevProps, nextProps) => {
        return prevProps.swatches.length === nextProps.swatches.length && prevProps.currentItem === nextProps.currentItem
    }
);

export function ProductBreadcrumb(props: ProductBreadcrumbProps) {

    const [swatches, setSwatches] = useState<SwatchItem[]>([])

    useEffect(()=>{
        const swatches:SwatchItem[] = []
        if (props.currentItem) {
            let current:SwatchItem|undefined = props.currentItem.parent
            while (current) {
                swatches.unshift(current)
                current = current.parent
            }
        }
        setSwatches(swatches)
    },[props])

    return <ProductBreadcrumbListing swatches={swatches} {...props} />
}