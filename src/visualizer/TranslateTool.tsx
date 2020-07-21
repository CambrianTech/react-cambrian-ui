import * as React from "react";
import {Fab} from "@material/react-fab";
import '@material/react-fab/dist/fab.css';
import {useCallback, useEffect, useRef} from "react";

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
    onMouseDown:()=>void
    onMouseUp:()=>void
}

export const TranslateToolCached = React.memo<TranslateToolCachedProps>(
    (cProps) => {

        if (cProps.visible) {

            let className = appendClassName("translate-tool", classes.translateTool);
            className = appendClassName(className, cProps.className);

            const min = cProps.min !== undefined ? cProps.min : -5;
            const max = cProps.max !== undefined ? cProps.max : 5;
            const range = max - min;
            const middle = min + range / 2;
            const minMiddle = min + range / 4;
            const maxMiddle = max - range / 4;

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
                                <input id={"translate-x"} type="range" min={min} max={max} step={0.01} defaultValue={cProps.xPos + ""}
                                       onMouseDown={()=>cProps.onMouseDown()} onMouseUp={()=>cProps.onMouseUp()}
                                       onChange={e => cProps.onTranslationXChanged(Number(e.target.value))} list="range-values" />
                            </div>

                            <div className={classes.translateToolSliderBar}>
                                <input id={"translate-y"} type="range" min={min} max={max} step={0.01} defaultValue={cProps.yPos + ""}
                                       onMouseDown={()=>cProps.onMouseDown()} onMouseUp={()=>cProps.onMouseUp()}
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

    const translationControl_xPos = useRef(0);
    const translationControl_yPos = useRef(0);
    const onTranslationChanged = props.onTranslationChanged;
    const isActive = useRef(false);

    const sendTranslationChanged = useCallback(() => {
        if (!isActive.current) return;
        onTranslationChanged(translationControl_xPos.current, translationControl_yPos.current);
    }, [translationControl_xPos, translationControl_yPos, onTranslationChanged]);

    const translationXChanged = useCallback((xPos: number) => {
        translationControl_xPos.current = xPos;
        sendTranslationChanged()
    }, [translationControl_xPos, sendTranslationChanged]);

    const translationYChanged = useCallback((yPos: number) => {
        translationControl_yPos.current = yPos;
        sendTranslationChanged()
    }, [translationControl_yPos, sendTranslationChanged]);

    const translationFinished = useCallback((commit: boolean) => {
        props.onTranslationFinished(commit, translationControl_xPos.current, translationControl_yPos.current)
    }, []);

    const [visible, xPos, yPos] = [props.visible, props.xPos, props.yPos]

    useEffect(()=>{
        if (visible) {
            translationControl_xPos.current = xPos;
            translationControl_yPos.current = yPos;
            if (!isActive.current) {
                const translateX = document.getElementById("translate-x") as HTMLInputElement;
                if (translateX) {
                    translateX.value = `${xPos}`
                }
                const translateY = document.getElementById("translate-y") as HTMLInputElement;
                if (translateY) {
                    translateY.value = `${yPos}`
                }
            }
        }
    }, [visible, xPos, yPos, translationControl_xPos, translationControl_yPos]);

    return (
        <TranslateToolCached {...props}
                             onMouseDown={()=>isActive.current = true}
                             onMouseUp={()=>isActive.current = false}

                             onTranslationXChanged={translationXChanged}
                             onTranslationYChanged={translationYChanged}
                             onTranslationFinishedInternal={translationFinished}
        />
    )
}