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
    min?: [number, number]
    max?: [number, number]
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

            const min = cProps.min !== undefined ? cProps.min : [-5, -5];
            const max = cProps.max !== undefined ? cProps.max : [5, 5];
            const range = [max[0] - min[0], max[1] - min[1]];
            const middle = [min[0] + range[0] / 2, min[1] + range[1] / 2];
            const minMiddle = [min[0] + range[0] / 4, min[1] + range[1] / 4];
            const maxMiddle = [max[0] - range[0] / 4, max[1] - range[1] / 4];

            return (
                <div className={className}>
                    <div className={appendClassName("translate-tool-content", classes.translateToolContent)}>
                        <div className={appendClassName("translate-tool-slider", classes.translateToolSlider)}>
                            <div className={appendClassName("translate-tool-slider-labels", classes.translateToolSliderLabels)}>
                                <div>{min[0]}</div>
                                <div>|&nbsp;</div>
                                <div>{minMiddle[0]}</div>
                                <div>|&nbsp;</div>
                                <div>{middle[0]}</div>
                                <div>|&nbsp;</div>
                                <div>{maxMiddle[0]}</div>
                                <div>|&nbsp;</div>
                                <div>{max[0]}</div>
                            </div>
                            <datalist id="range-values-0">
                                <option value={min[0]} />
                                <option value={minMiddle[0]} />
                                <option value={middle[0]} />
                                <option value={maxMiddle[0]} />
                                <option value={max[0]} />
                            </datalist>

                            <div className={appendClassName("translate-tool-slider-bar", classes.translateToolSliderBar)}>
                                <input id={"translate-x"} type="range" min={min[0]} max={max[0]} step={0.01} defaultValue={cProps.xPos + ""}
                                       onMouseDown={()=>cProps.onMouseDown()} onTouchStart={()=>cProps.onMouseDown()}
                                       onMouseUp={()=>cProps.onMouseUp()} onTouchEnd={()=>cProps.onMouseUp()}
                                       onChange={e => cProps.onTranslationXChanged(Number(e.target.value))} list="range-values-0" />
                            </div>

                            <div className={appendClassName("translate-tool-slider-labels", classes.translateToolSliderLabels)}>
                                <div>{min[1]}</div>
                                <div>|&nbsp;</div>
                                <div>{minMiddle[1]}</div>
                                <div>|&nbsp;</div>
                                <div>{middle[1]}</div>
                                <div>|&nbsp;</div>
                                <div>{maxMiddle[1]}</div>
                                <div>|&nbsp;</div>
                                <div>{max[1]}</div>
                            </div>
                            <datalist id="range-values-1">
                                <option value={min[1]} />
                                <option value={minMiddle[1]} />
                                <option value={middle[1]} />
                                <option value={maxMiddle[1]} />
                                <option value={max[1]} />
                            </datalist>

                            <div className={appendClassName("translate-tool-slider-bar", classes.translateToolSliderBar)}>
                                <input id={"translate-y"} type="range" min={min[1]} max={max[1]} step={0.01} defaultValue={cProps.yPos + ""}
                                       onMouseDown={()=>cProps.onMouseDown()} onMouseUp={()=>cProps.onMouseUp()}
                                       onChange={e => cProps.onTranslationYChanged(Number(e.target.value))} list="range-values-1" />
                            </div>

                            <div className={appendClassName("translate-tool-instructions", classes.translateToolInstructions)}>
                                Click and drag objects or adjust sliders.
                            </div>
                        </div>
                        <div className={appendClassName("translate-tool-footer", classes.translateToolFooter)}>
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