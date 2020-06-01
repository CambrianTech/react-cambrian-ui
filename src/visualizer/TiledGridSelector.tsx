import {default as React, useCallback, useEffect, useState} from "react";

import {appendClassName} from "../internal/Utils";
import classes from "./TiledGridSelector.scss";
import {CBARTiledAsset, TiledGridType, getEnumKeys} from "react-home-ar";

type TiledGridSelectorProps = {
    visible: boolean
    className?:string
    tiledAsset: CBARTiledAsset | undefined
    onGridTypeSelected?: (type: TiledGridType) => void
    resolveImagePath: (name:string, type: TiledGridType) => string
    restrictToProduct?:boolean
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

            let types = getEnumKeys(TiledGridType)

            if (props.restrictToProduct && props.tiledAsset && props.tiledAsset.product) {
                const availableTypes = props.tiledAsset.product.patterns
                types = types.filter(type=>availableTypes.indexOf(TiledGridType[type]) >= 0)
            }

            return (
                <div className={className}>
                    {types.map((name) => {
                        const type = TiledGridType[name]
                        const isSelected = type === props.internalSelectedGridType
                        let className = appendClassName("tiled-grid-selector-element", classes.tiledGridSelectorElement)
                        if (isSelected) {
                            //annoying that multiple class names didn't work: aka &.selected
                            className = appendClassName(className, classes.tiledGridSelectorElement_Selected)
                            className = appendClassName(className,"selected")
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
    }
);

export function TiledGridSelector(props: TiledGridSelectorProps) {

    const [gridType, setGridType] = useState<TiledGridType>()

    const onGridTypeSelected = useCallback((type: TiledGridType) => {
        if (props.tiledAsset) {
            props.tiledAsset.gridType = type
            setGridType(type)
        }
        if (props.onGridTypeSelected) {
            props.onGridTypeSelected(type)
        }
    }, [props])

    useEffect(()=>{
        setGridType(props.tiledAsset ? props.tiledAsset.gridType : undefined)
    }, [props.tiledAsset])

    return (
        <TiledGridSelectorCached
            internalGridTypeSelected={onGridTypeSelected}
            internalSelectedGridType={gridType}
            {...props} />
    )
}