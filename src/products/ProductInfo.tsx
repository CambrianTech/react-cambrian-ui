import {default as React} from "react";
import {ProductItem} from "react-home-ar";
import classes from "./ProductInfo.scss";
import {appendClassName} from "../internal/Utils";
import {LazyImage} from "react-lazy-elements";

type ProductInfoProps = {
    product?:ProductItem
    className?:string
    resolveUrl:(name:string, url:string)=>string
}

export const ProductInfoCached = React.memo<ProductInfoProps>(

    (props) => {
        if (props.product && props.product.details) {

            let className = appendClassName("product-info", classes.productInfo);
            if (props.className) {
                className = appendClassName(className, props.className);
            }

            const details = props.product.details;
            const specs = details.specifications;
            return (
                <div className={className}>
                    <div className={appendClassName("product-info-name", classes.productName)}>
                        {props.product.parent && <div className={appendClassName("product-info-title", classes.productTitle)}>
                            {props.product.parent.displayName}
                        </div>}
                        <div className={appendClassName("product-info-sub-title", classes.productSubTitle)}>
                            {props.product.displayName}
                        </div>
                    </div>
                    {details.preview && <LazyImage className={appendClassName("preview", classes.preview)}
                                                   src={props.resolveUrl("preview", details.preview)} />}
                    <ul className={appendClassName("specs", classes.specs)}>
                        {Object.keys(specs).map((field) => {
                            return <li key={field} className={appendClassName("field", classes.field)}>
                                <div className={appendClassName("fieldName", classes.fieldName)}>{field}</div>
                                <div className={appendClassName("fieldValue", classes.fieldValue)}>{specs[field]}</div>
                            </li>
                        })}
                    </ul>
                    <div>
                        <a href={details.url}>More details...</a>
                    </div>
                </div>
            );
        }
        return null;
    },
    (prevProps, nextProps) => {
        return prevProps.product === nextProps.product;
    }
);

export function ProductInfo(props: ProductInfoProps) {
    return <ProductInfoCached {...props} />
}