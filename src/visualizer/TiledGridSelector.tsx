import {default as React, useCallback} from "react";

import {appendClassName} from "../internal/Utils";
import classes from "./TiledGridSelector.scss";
import {CBARTiledAsset, TiledGridType} from "react-home-ar";

type TiledGridSelectorProps = {
    visible: boolean
    className?:string
    selectedGridType?: TiledGridType
    tiledAsset?: CBARTiledAsset
    onGridTypeSelected?: (type: TiledGridType) => void
    resolveImagePath: (name:string, type: TiledGridType) => string
}

type TiledGridSelectorPropsInternal = TiledGridSelectorProps & {
    internalGridTypeSelected: (type: TiledGridType) => void
    internalSelectedGridType: TiledGridType|undefined
}

export const TiledGridSelectorCached = React.memo<TiledGridSelectorPropsInternal>(
    (props) => {
        if (props.visible) {
            let className = appendClassName("tiled-grid-selector", classes.tiledGridSelector)
            className = appendClassName(className, props.className)

            const types = Object.keys(TiledGridType).filter(key => !isNaN(Number(TiledGridType[key])));

            return (
                <div className={className}>
                    {types.map((name) => {
                        const type = TiledGridType[name]
                        const isSelected = type === props.internalSelectedGridType
                        let className = appendClassName("tiled-grid-selector-element", classes.tiledGridSelectorElement)
                        if (isSelected) {
                            className = appendClassName("selected", className)
                        }
                        return (
                            <div key={name} className={className} onClick={()=>props.internalGridTypeSelected(type)}>
                                <div className={appendClassName("tiled-grid-selector-element-text", classes.tiledGridSelectorElementText)}>
                                    {name}
                                </div>
                                <img className={appendClassName("tiled-grid-selector-element-image", classes.tiledGridSelectorElementImage)}
                                     src={props.resolveImagePath(name, type)}
                                     alt={name} />
                            </div>
                        )
                    })}
                </div>
            );
        }
        return (<aside />);
    },
    (prevProps, nextProps) => {
        return prevProps.visible === nextProps.visible;
    }
);

export function TiledGridSelector(props: TiledGridSelectorProps) {

    const onGridTypeSelected = useCallback((type: TiledGridType) => {
        if (props.tiledAsset) {
            console.log(`Set grid type to ${type}`)
            props.tiledAsset.gridType = type
        }
        if (props.onGridTypeSelected) {
            props.onGridTypeSelected(type)
        }
    }, [props])

    const selectedType = props.tiledAsset ? props.tiledAsset.gridType : props.selectedGridType

    return (
        <TiledGridSelectorCached
            internalGridTypeSelected={onGridTypeSelected}
            internalSelectedGridType={selectedType}
            {...props} />
    )
}