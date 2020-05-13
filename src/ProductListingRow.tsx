import * as React from "react";
import classes from "./ProductListingRow.scss";

type ProductListingRowProps = {
    visible: boolean
}

export const ProductListingRowCached = React.memo<ProductListingRowProps>(
    (cProps) => {
        if (cProps.visible) {
            return (
                <div className={classes.productListingRow}>

                </div>
            );
        }
        return (<aside />);
    },
    (prevProps, nextProps) => {
        return prevProps.visible === nextProps.visible;
    }
);

export function ProductListingRow(props: ProductListingRowProps) {

    return (
        <ProductListingRowCached visible={props.visible} />
    )
}