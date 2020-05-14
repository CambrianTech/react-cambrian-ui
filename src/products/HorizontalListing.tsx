import * as React from "react";
import classes from "./HorizontalListing.scss";
import {SwatchItem, SwatchListing} from "../data";

type HorizontalListingProps = {
    visible: boolean,
    parent?:SwatchListing
    selectedSwatch?:SwatchItem
}

export const HorizontalListingCached = React.memo<HorizontalListingProps>(
    (cProps) => {
        if (cProps.visible && cProps.parent) {
            return (
                <div className={classes.horizontalListing}>
                    {cProps.parent.children.map((swatch) => {
                        return (
                            <div key={swatch.key} className={classes.horizontalListingItem}>
                                <img className={classes.horizontalListingSwatch} src={swatch.thumbnailPath} alt={swatch.displayName} />
                                <div className={classes.horizontalListingDetails}>
                                    {swatch.displayName}
                                </div>
                            </div>
                        )
                    })}
                </div>
            );
        }
        return (<aside />);
    }
);

export function HorizontalListing(props: HorizontalListingProps) {

    return (
        <HorizontalListingCached {...props} />
    )
}