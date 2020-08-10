import {default as React} from "react";
import {ProductItem} from "react-home-ar";
import classes from "./SharePanel.scss";
import {appendClassName} from "../internal/Utils";

type SharePanelProps = {
    visible:boolean
    product?:ProductItem
    className?:string
    resolveUrl:(name:string, url:string|undefined)=>string
}

export const SharePanelCached = React.memo<SharePanelProps>(

    (props) => {
        if (props.visible && props.product && props.product.details) {

            let className = appendClassName("share", classes.productInfo);
            if (props.className) {
                className = appendClassName(className, props.className);
            }

            const details = props.product.details;
            const specs = details.specifications;

            return (
                <div className={className}>
                    <div className={appendClassName("share-name", classes.shareName)}>
                        {props.product.parent && <div className={appendClassName("share-title", classes.shareTitle)}>
                            {props.product.parent.displayName}
                        </div>}
                        <div className={appendClassName("share-sub-title", classes.shareSubTitle)}>
                            {props.product.displayName}
                        </div>
                    </div>
                    {props.visible && <img className={appendClassName("preview", classes.preview)} src={props.resolveUrl("preview", details.preview)} />}
                </div>
            );
        }
        return null;
    },
    (prevProps, nextProps) => {
        return prevProps.visible === nextProps.visible && prevProps.product === nextProps.product;
    }
);

export function SharePanel(props: SharePanelProps) {
    return <SharePanelCached {...props} />
}