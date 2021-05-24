import {default as React} from "react";
import classes from "./ProductDetails.scss";
import {appendClassName} from "../internal/Utils";
import {DetailsConfig} from "cambrian-base";

type ProductDetailsProps = {
    visible:boolean
    className?:string
    title?:string|undefined
    subTitle?:string|undefined
    code?:string|undefined
    details?:DetailsConfig
    resolveUrl:(name:string, url:string|undefined)=>string
    children?:React.ReactNode
}

const ProductDetailsCached = React.memo<ProductDetailsProps>(

    (props) => {
        if (props.visible) {

            let className = appendClassName("product-details", classes.productInfo);
            if (props.className) {
                className = appendClassName(className, props.className);
            }

            const preview = props.details ? props.details.preview : undefined;
            const content = props.details ? props.details.content : undefined;
            const specs = props.details ? props.details.specifications?.filter(s=>!s.hidden) : undefined;
            const url = props.details ? props.details.url : undefined;

            return (
                <div className={className}>

                    <div className={appendClassName("product-details-name", classes.productName)}>
                        {props.title && <div className={appendClassName("product-details-title", classes.productTitle)}>
                            {props.title}
                        </div>}
                        {props.subTitle && <div className={appendClassName("product-details-sub-title", classes.productSubTitle)}>
                            {props.subTitle}
                        </div>}
                        {props.code && <div className={appendClassName("product-details-sub-code", classes.productCode)}>
                            {props.code}
                        </div>}
                    </div>

                    {preview && <img alt="preview" className={appendClassName("preview", classes.preview)} src={props.resolveUrl("preview", preview)} />}

                    {content && <pre className={appendClassName("product-details-content", classes.productContent)}>
                        {content}
                    </pre>}

                    {specs && <ul className={appendClassName("specs", classes.specs)}>
                        {specs.map(spec => {
                            if (!(spec as any).hasOwnProperty("code")) {
                                //backwards compatibility:
                                spec = {
                                    code:Object.keys(spec as any)[0],
                                    displayName:Object.keys(spec as any)[0],
                                    displayValue:Object.values(spec as any)[0] as string
                                }
                            }
                            return <li key={spec.code} className={appendClassName("field", classes.field)}>
                                <div className={appendClassName("fieldName", classes.fieldName)}>{`${spec.displayName}`}</div>
                                <div className={appendClassName("fieldValue", classes.fieldValue)}>{`${spec.displayValue}`}</div>
                            </li>
                        })}
                    </ul>}

                    {url && <div className={classes.callToAction}><a href={url} target={"_blank"}>More details...</a></div>}
                    {props.children}
                </div>
            );
        }
        return null;
    },
    (prevProps, nextProps) => {
        return prevProps.visible === nextProps.visible && prevProps.title === nextProps.title && prevProps.details === nextProps.details;
    }
);

export function ProductDetails(props: ProductDetailsProps) {
    return <ProductDetailsCached {...props} />
}