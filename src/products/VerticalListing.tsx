import * as React from "react";
import classes from "./VerticalListing.scss";
import {SwatchItem, SwatchListing} from "../data";
import {HorizontalListing} from "./HorizontalListing";

type VerticalListingProps = {
    visible: boolean,
    parent?:SwatchListing
    selectedRow?:SwatchItem|SwatchListing
    onRowSelected:(item:SwatchItem)=>void
}

export const VerticalListingCached = React.memo<VerticalListingProps>(
    (cProps) => {
        if (cProps.visible && cProps.parent) {
            return (
                <div className={classes.verticalListing}>
                    {cProps.parent.children.map((swatch) => {
                        return (
                            <div key={swatch.key} className={classes.verticalListingRow} onClick={()=>cProps.onRowSelected(swatch)}>
                                <div className={classes.verticalListingDetails}>
                                    <img className={classes.verticalListingSwatch} src={swatch.thumbnailPath} alt={swatch.displayName} />
                                    <div className={classes.verticalListingInfo}>
                                        <div className={classes.verticalListingTitle}>{swatch.displayName}</div>
                                        <div className={classes.verticalListingDescription}>{swatch.description}</div>
                                    </div>
                                </div>
                                <HorizontalListing visible={cProps.selectedRow === swatch} parent={cProps.selectedRow as SwatchListing} />
                            </div>
                        )
                    })}
                </div>
            );
        }
        return (<aside />);
    }
);

export function VerticalListing(props: VerticalListingProps) {

    return (
        <VerticalListingCached {...props} />
    )
}