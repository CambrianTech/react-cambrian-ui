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

    onMouseDown:(e:any, isX:boolean)=>void
    onMouseUp:(e:any, isX:boolean)=>void
    onMouseMove:(e:any, isX:boolean)=>void
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

                            <div onMouseDown={(e)=>cProps.onMouseDown(e,true)} onTouchStart={(e)=>cProps.onMouseDown(e,true)}
                                 onMouseMove={(e)=>cProps.onMouseMove(e,true)} onTouchMove={(e)=>cProps.onMouseMove(e,true)}
                                 onMouseUp={(e)=>cProps.onMouseUp(e,true)} onTouchEnd={(e)=>cProps.onMouseUp(e,true)}>
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
                                           onChange={e => cProps.onTranslationXChanged(Number(e.target.value))} list="range-values-0" />
                                </div>
                            </div>

                            <div onMouseDown={(e)=>cProps.onMouseDown(e,false)} onTouchStart={(e)=>cProps.onMouseDown(e,false)}
                                 onMouseMove={(e)=>cProps.onMouseMove(e,false)} onTouchMove={(e)=>cProps.onMouseMove(e,false)}
                                 onMouseUp={(e)=>cProps.onMouseUp(e,false)} onTouchEnd={(e)=>cProps.onMouseUp(e,false)}>
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
                                           onChange={e => cProps.onTranslationYChanged(Number(e.target.value))} list="range-values-1" />
                                </div>
                            </div>

                            <div className={appendClassName("translate-tool-instructions", classes.translateToolInstructions)}>
                                Click and drag objects or adjust sliders.
                            </div>
                        </div>
                        <div className={appendClassName("translate-tool-footer", classes.translateToolFooter)}>
                            <Fab className={appendClassName("cancel", classes.translateToolSliderCancel)} icon={cProps.cancelIcon ? cProps.cancelIcon : <MaterialIcon icon='close' />} onClick={() => cProps.onTranslationFinishedInternal(false)}  />
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

    const [onTranslationChanged, onTranslationFinished] = [props.onTranslationChanged, props.onTranslationFinished];

    const translationControl_xPos = useRef(0);
    const translationControl_yPos = useRef(0);

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
        onTranslationFinished(commit, translationControl_xPos.current, translationControl_yPos.current)
    }, [onTranslationFinished]);

    const adjustSlider = useCallback((e:any, isX:boolean)=>{

        const slider = (isX ? document.getElementById("translate-x") : document.getElementById("translate-y")) as HTMLInputElement

        if (slider && e.hasOwnProperty("pageX") && e.hasOwnProperty("target")) {
            const rect = slider.getBoundingClientRect();
            const sliderDiameter = rect.height;
            const x = (e.clientX - rect.left - 0.5 * sliderDiameter) / (rect.width - sliderDiameter);
            const range = parseFloat(slider.max) - parseFloat(slider.min);
            const value = parseFloat(slider.min) + range * x;

            const currrentValue = parseFloat(slider.value);

            if (Math.abs(currrentValue - value) > 0.1) {
                slider.value = `${value}`;
                if (isX) {
                    translationXChanged(value);
                } else {
                    translationYChanged(value);
                }
            }
        }
    }, [translationXChanged, translationYChanged]);

    const onMouseDown = useCallback((e:any, isX:boolean) => {
        isActive.current = true;
        adjustSlider(e, isX);
    }, [isActive, adjustSlider]);

    const onMouseMove = useCallback((e:any, isX:boolean) => {
        if (isActive.current) {
            adjustSlider(e, isX);
        }
    }, [adjustSlider]);

    const onMouseUp = useCallback((e:any) => {
        isActive.current = false;
    }, [isActive, adjustSlider]);

    const [visible, xPos, yPos] = [props.visible, props.xPos, props.yPos];

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
                             onMouseDown={onMouseDown}
                             onMouseMove={onMouseMove}
                             onMouseUp={onMouseUp}
                             onTranslationXChanged={translationXChanged}
                             onTranslationYChanged={translationYChanged}
                             onTranslationFinishedInternal={translationFinished}
        />
    )
}