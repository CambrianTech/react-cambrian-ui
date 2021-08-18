import * as React from "react";
import {useRef} from "react";
import classes from "./VisualizerTools.scss";
import {appendClassName} from "../internal/Utils"
import {useEffect} from "react";
import {useCallback} from "react";
import {Fab, Icon} from "@material-ui/core";

type RotateToolProps = {
    visible: boolean
    className?:string
    rotation: number
    onRotationStarted: () => void
    onRotationFinished: (commit: boolean, rotation: number) => void
    onRotationChanged: (rotation: number) => void
    cancelIcon?:React.ReactElement<HTMLElement>
    confirmIcon?:React.ReactElement<HTMLElement>
    directions?:string
}

type RotateToolCachedProps = RotateToolProps & {
    onMouseDown:(e:any)=>void
    onMouseUp:(e:any)=>void
    onMouseMove:(e:any)=>void
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
            let className = appendClassName("rotate-tool", classes.overlayTool);
            className = appendClassName(className, cProps.className);

            return (
                <div className={className}>
                    <div className={"rotate-tool-content"}>
                        <div className={appendClassName("rotate-tool-slider", classes.toolSlider)}
                             onMouseDown={(e)=>cProps.onMouseDown(e)} onTouchStart={(e)=>cProps.onMouseDown(e)}
                             onMouseMove={(e)=>cProps.onMouseMove(e)} onTouchMove={(e)=>cProps.onMouseMove(e)}
                             onMouseUp={(e)=>cProps.onMouseUp(e)} onTouchEnd={(e)=>cProps.onMouseUp(e)}>

                            <div className={appendClassName("rotate-tool-labels", classes.toolSliderLabels)}>
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

                            <div className={appendClassName("rotate-tool-slider-bar", classes.toolSliderBar)}>

                                <input id={"rotate-input"} type="range" min={-180} max={180} step={0.5} defaultValue={toDegrees(cProps.rotation).toFixed(3)}
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

                            <div className={appendClassName("rotate-tool-instructions", classes.overlayInstructions)}>
                                {cProps.directions ? cProps.directions : "Click and drag objects or adjust the slider."}
                            </div>
                        </div>
                        <div className={appendClassName("rotate-tool-footer", classes.overlayFooter)}>
                            <Fab className={appendClassName("cancel", classes.cancelButton)} onClick={() => cProps.onRotationFinished(false, 0)} >
                                {cProps.cancelIcon ? cProps.cancelIcon : <Icon>close</Icon>}
                            </Fab>
                            <Fab className={appendClassName("confirm", classes.confirmButton)} onClick={() => cProps.onRotationFinished(true, 0)}>
                                {cProps.confirmIcon ? cProps.confirmIcon : <Icon>check</Icon>}
                            </Fab>
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

    const [rotation, visible, onRotationStarted, onRotationChanged, onRotationFinished] = [props.rotation, props.visible, props.onRotationStarted, props.onRotationChanged, props.onRotationFinished];

    const rotateChanged = useCallback((radians: number) => {
        rotationControlValue.current = radians;
        if (isActive.current) {
            onRotationChanged(rotationControlValue.current);
        }
    }, [rotationControlValue, isActive, onRotationChanged]);

    const rotateFinished = useCallback((commit: boolean) => {
        onRotationFinished(commit, rotationControlValue.current)
    }, [onRotationFinished, rotationControlValue]);

    const setRotation = useCallback((value:number) => {
        const rotateInput = document.getElementById("rotate-input") as HTMLInputElement;
        if (rotateInput) {
            rotateInput.value = `${toDegrees(-1.0 * value)}`
        }
    }, [isActive]);

    const adjustSlider = useCallback((e:any, rotateInput:HTMLInputElement)=>{

        if (rotateInput && e.hasOwnProperty("pageX") && e.hasOwnProperty("target")) {
            const rect = rotateInput.getBoundingClientRect();
            const sliderDiameter = rect.height;
            const x = (e.clientX - rect.left - 0.5 * sliderDiameter) / (rect.width - sliderDiameter);
            const range = parseFloat(rotateInput.max) - parseFloat(rotateInput.min);
            const value = parseFloat(rotateInput.min) + range * x;

            const currrentValue = parseFloat(rotateInput.value);
            if (Math.abs(currrentValue - value) > 5.0) {
                const radians = -1.0 * toRadians(value);
                setRotation(radians);
                onRotationChanged(radians);
            }
        }
    }, [setRotation]);

    const onMouseDown = useCallback((e:any) => {
        isActive.current = true;
        adjustSlider(e, document.getElementById("rotate-input") as HTMLInputElement);
    }, [isActive, adjustSlider]);

    const onMouseMove = useCallback((e:any) => {
        if (isActive.current) {
            adjustSlider(e, document.getElementById("rotate-input") as HTMLInputElement);
        }
    }, [adjustSlider]);

    const onMouseUp = useCallback((e:any) => {
        isActive.current = false;
    }, [isActive, adjustSlider]);

    useEffect(()=>{
        if (visible) {
            rotationControlValue.current = rotation;

            if (!isActive.current) {
                setRotation(rotation)
            }
            onRotationStarted();
        }
    }, [visible, rotationControlValue, isActive, rotation, onRotationStarted]);

    return (
        <RotateToolCached {...props}
                          onMouseDown={onMouseDown}
                          onMouseUp={onMouseUp}
                          onMouseMove={onMouseMove}
                          onRotationChanged={rotateChanged}
                          onRotationFinished={rotateFinished} />
    )
}