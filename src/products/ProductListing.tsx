import * as React from "react";
import classes from "./ProductListing.scss";
import {Product} from "../data";

type ProductListingProps = {
    visible: boolean,
    product?:Product
}

export const ProductListingCached = React.memo<ProductListingProps>(
    (cProps) => {
        if (cProps.visible) {
            return (
                <div className={classes.productListing}>

                </div>
            );
        }
        return (<aside />);
    },
    (prevProps, nextProps) => {
        return prevProps.visible === nextProps.visible;
    }
);

export function ProductListing(props: ProductListingProps) {

    return (
        <ProductListingCached visible={props.visible} />
    )
}