import * as React from "react";
import {Fab} from "@material/react-fab";
import '@material/react-fab/dist/fab.css';
import {useRef} from "react";

import classes from "./RotateTool.scss";
import MaterialIcon from "@material/react-material-icon";

import {appendClassName} from "../internal/Utils"
import {useEffect} from "react";
import {useCallback} from "react";

type RotateToolProps = {
    visible: boolean
    className?:string
    rotation: number
    onRotationFinished: (commit: boolean, rotation: number) => void
    onRotationChanged: (rotation: number) => void
    cancelIcon?:React.ReactElement<HTMLElement>
    confirmIcon?:React.ReactElement<HTMLElement>
}

type RotateToolCachedProps = RotateToolProps & {
    onMouseDown:()=>void
    onMouseUp:()=>void
}

function toDegrees(radians: number) {
    return radians * 180 / Math.PI
}

function toRadians(degrees: number) {
    return degrees * Math.PI / 180
}

export const RotateToolCached = React.memo<RotateToolCachedProps>(
    (cProps) => {
        if (cProps.visible) {
            let className = appendClassName("rotate-tool", classes.rotateTool);
            className = appendClassName(className, cProps.className);

            return (
                <div className={className}>
                    <div className={appendClassName("rotate-tool-content", classes.rotateToolContent)}>
                        <div className={appendClassName("rotate-tool-slider", classes.rotateToolSlider)}>
                            <div className={appendClassName("rotate-tool-labels", classes.rotateToolSliderLabels)}>
                                <div>-180°</div>
                                <div>|&nbsp;</div>
                                <div>-90°</div>
                                <div>|&nbsp;</div>
                                <div>0°</div>
                                <div>|&nbsp;</div>
                                <div>90°</div>
                                <div>|&nbsp;</div>
                                <div>180°</div>
                            </div>
                            <div className={appendClassName("rotate-tool-slider-bar", classes.rotateToolSliderBar)}>
                                <input id={"rotate-input"} type="range" min={-180} max={180} step={0.5} defaultValue={toDegrees(cProps.rotation) + ""}
                                       onMouseDown={()=>cProps.onMouseDown()} onTouchStart={()=>cProps.onMouseDown()}
                                       onMouseUp={()=>cProps.onMouseUp()} onTouchEnd={()=>cProps.onMouseUp()}
                                       onChange={e => cProps.onRotationChanged(-1.0 * toRadians(Number(e.target.value)))} list="range-values" />
                                <datalist id="range-values">
                                    <option value="-180" />
                                    <option value="-135" />
                                    <option value="-90" />
                                    <option value="-45" />
                                    <option value="0" />
                                    <option value="45" />
                                    <option value="90" />
                                    <option value="135" />
                                    <option value="180" />
                                </datalist>
                            </div>

                            <div className={appendClassName("rotate-tool-instructions", classes.rotateToolInstructions)}>
                                Click and drag objects or adjust the slider.
                            </div>
                        </div>
                        <div className={appendClassName("rotate-tool-footer", classes.rotateToolFooter)}>
                            <Fab className={appendClassName("cancel", classes.rotateToolSliderCancel)} icon={cProps.cancelIcon ? cProps.cancelIcon : <MaterialIcon icon='close' />} onClick={() => cProps.onRotationFinished(false, 0)}  />
                            <Fab className={appendClassName("confirm", classes.rotateToolSliderConfirm)} icon={cProps.confirmIcon ? cProps.confirmIcon : <MaterialIcon icon='check' />} onClick={() => cProps.onRotationFinished(true, 0)} />
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

export function RotateTool(props: RotateToolProps) {
    const rotationControlValue = useRef(0);
    const isActive = useRef(false);

    const [rotation, visible, onRotationChanged, onRotationFinished] = [props.rotation, props.visible, props.onRotationChanged, props.onRotationFinished];

    const rotateChanged = useCallback((radians: number) => {
        rotationControlValue.current = radians;
        if (isActive.current) {
            onRotationChanged(rotationControlValue.current);
        }
    }, [rotationControlValue, isActive, onRotationChanged]);

    const rotateFinished = useCallback((commit: boolean) => {
        onRotationFinished(commit, rotationControlValue.current)
    }, [onRotationFinished, rotationControlValue]);

    useEffect(()=>{
        if (visible) {
            rotationControlValue.current = rotation;

            if (!isActive.current) {
                const rotateInput = document.getElementById("rotate-input") as HTMLInputElement;
                if (rotateInput) {
                    rotateInput.value = `${toDegrees(-1.0 * rotation)}`
                }
            }
        }
    }, [visible, rotationControlValue, isActive, rotation]);

    return (
        <RotateToolCached {...props}
                          onMouseDown={()=>isActive.current = true}
                          onMouseUp={()=>isActive.current = false}
                          onRotationChanged={rotateChanged}
                          onRotationFinished={rotateFinished} />
    )
}