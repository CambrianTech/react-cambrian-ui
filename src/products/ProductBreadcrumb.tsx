import {default as React} from "react";
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

    const swatches:SwatchItem[] = []
    let current = props.currentItem
    while (current) {
        swatches.unshift(current)
        current = current.parent
    }

    return <ProductBreadcrumbListing swatches={swatches} {...props} />
}