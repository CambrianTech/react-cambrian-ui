import * as React from "react";
import {Fab} from "@material/react-fab";
import '@material/react-fab/dist/fab.css';
import {useEffect, useRef} from "react";

import classes from "./TranslateTool.scss";
import MaterialIcon from "@material/react-material-icon";

import {appendClassName} from "../internal/Utils"

type TranslateToolProps = {
    visible: boolean
    className?:string
    xPos: number
    yPos: number
    min?: number
    max?: number
    onTranslationFinished: (commit: boolean, xPos: number, yPos: number) => void
    onTranslationChanged: (xPos: number, yPos: number) => void

    cancelIcon?:React.ReactElement<HTMLElement>
    confirmIcon?:React.ReactElement<HTMLElement>
}

type TranslateToolCachedProps = TranslateToolProps & {
    onTranslationXChanged:(xPos: number) => void
    onTranslationYChanged:(yPos: number) => void
    onTranslationFinishedInternal: (commit: boolean) => void
}

export const TranslateToolCached = React.memo<TranslateToolCachedProps>(
    (cProps) => {
        if (cProps.visible) {

            let className = appendClassName("translate-tool", classes.translateTool)
            className = appendClassName(className, cProps.className)

            const min = cProps.min !== undefined ? cProps.min : -5
            const max = cProps.max !== undefined ? cProps.max : 5
            const range = max - min
            const middle = min + range / 2
            const minMiddle = min + range / 4
            const maxMiddle = max - range / 4

            return (
                <div className={className}>
                    <div>
                        <div className={classes.translateToolSlider}>
                            <div className={classes.translateToolSliderLabels}>
                                <div>{min}</div>
                                <div>|&nbsp;</div>
                                <div>{minMiddle}</div>
                                <div>|&nbsp;</div>
                                <div>{middle}</div>
                                <div>|&nbsp;</div>
                                <div>{maxMiddle}</div>
                                <div>|&nbsp;</div>
                                <div>{max}</div>
                            </div>
                            <div className={classes.translateToolSliderBar}>
                                <input type="range" min={min} max={max} step={0.01} defaultValue={cProps.xPos + ""}
                                       onChange={e => cProps.onTranslationXChanged(Number(e.target.value))} list="range-values" />
                            </div>

                            <div className={classes.translateToolSliderBar}>
                                <input type="range" min={min} max={max} step={0.01} defaultValue={cProps.yPos + ""}
                                       onChange={e => cProps.onTranslationYChanged(Number(e.target.value))} list="range-values" />
                            </div>

                            <datalist id="range-values">
                                <option value={min} />
                                <option value={minMiddle} />
                                <option value={middle} />
                                <option value={maxMiddle} />
                                <option value={max} />
                            </datalist>
                        </div>
                        <div className={classes.translateToolSliderFooter}>
                            <Fab className={appendClassName("cancel", classes.translateToolSliderCancel)} icon={cProps.cancelIcon ? cProps.cancelIcon : <MaterialIcon icon='close' />} style={{backgroundColor:"#555"}} onClick={() => cProps.onTranslationFinishedInternal(false)}  />
                            <Fab className={appendClassName("confirm", classes.translateToolSliderConfirm)} icon={cProps.confirmIcon ? cProps.confirmIcon : <MaterialIcon icon='check' />} onClick={() => cProps.onTranslationFinishedInternal(true)} />
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    },
    (prevProps, nextProps) => {
        return prevProps.visible === nextProps.visible;
    }
);

export function TranslateTool(props: TranslateToolProps) {
    const translationControl_xPos = useRef(0)
    const translationControl_yPos = useRef(0)

    function translationXChanged(xPos: number) {
        translationControl_xPos.current = xPos
        props.onTranslationChanged(xPos, translationControl_yPos.current)
    }

    function translationYChanged(yPos: number) {
        translationControl_yPos.current = yPos
        props.onTranslationChanged(translationControl_xPos.current, yPos)
    }

    function translationFinished(commit: boolean) {
        props.onTranslationFinished(commit, translationControl_xPos.current, translationControl_yPos.current)
    }

    useEffect(()=>{
        if (props.visible) {
            translationControl_xPos.current = props.xPos
            translationControl_yPos.current = props.yPos
        }
    }, [props.visible])

    return (
        <TranslateToolCached {...props}
                             onTranslationXChanged={translationXChanged}
                             onTranslationYChanged={translationYChanged}
                             onTranslationFinishedInternal={translationFinished}
                             />
    )
}