import {default as React} from "react";
import classes from "./ProductInfo.scss";
import {appendClassName} from "../internal/Utils";
import {ProductDetails} from "react-home-ar";

type ProductInfoProps = {
    visible:boolean
    className?:string
    title?:string|undefined
    subTitle?:string|undefined
    details?:ProductDetails
    resolveUrl:(name:string, url:string|undefined)=>string
}

export const ProductInfoCached = React.memo<ProductInfoProps>(

    (props) => {
        if (props.visible) {

            let className = appendClassName("product-info", classes.productInfo);
            if (props.className) {
                className = appendClassName(className, props.className);
            }

            const preview = props.details ? props.details.preview : undefined;
            const content = props.details ? props.details.content : undefined;
            const specs = props.details ? props.details.specifications : undefined;
            const url = props.details ? props.details.url : undefined;

            return (
                <div className={className}>

                    <div className={appendClassName("product-info-name", classes.productName)}>
                        {props.title && <div className={appendClassName("product-info-title", classes.productTitle)}>
                            {props.title}
                        </div>}
                        {props.subTitle && <div className={appendClassName("product-info-sub-title", classes.productSubTitle)}>
                            {props.subTitle}
                        </div>}
                    </div>

                    {preview && <img className={appendClassName("preview", classes.preview)} src={props.resolveUrl("preview", preview)} />}

                    {content && <pre className={appendClassName("product-info-content", classes.productContent)}>
                        {content}
                    </pre>}

                    {specs && <ul className={appendClassName("specs", classes.specs)}>
                        {Object.keys(specs).map((field) => {
                            return <li key={field} className={appendClassName("field", classes.field)}>
                                <div className={appendClassName("fieldName", classes.fieldName)}>{field}</div>
                                <div className={appendClassName("fieldValue", classes.fieldValue)}>{specs[field]}</div>
                            </li>
                        })}
                    </ul>}

                    {url && <div><a href={url} target={"_blank"}>More details...</a></div>}
                </div>
            );
        }
        return null;
    },
    (prevProps, nextProps) => {
        return prevProps.visible === nextProps.visible && prevProps.title === nextProps.title && prevProps.details === nextProps.details;
    }
);

export function ProductInfo(props: ProductInfoProps) {
    return <ProductInfoCached {...props} />
}