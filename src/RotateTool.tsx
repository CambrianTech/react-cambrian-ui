import * as React from "react";
import {Fab} from "@material/react-fab";
import '@material/react-fab/dist/fab.css';
import {useRef} from "react";

import classes from "./RotateTool.module.scss";
import MaterialIcon from "@material/react-material-icon";

type RotateToolProps = {
    visible: boolean
    rotation: number
    onRotationFinished: (commit: boolean, rotation: number) => void
    onRotationChanged: (rotation: number) => void
}

function toDegrees(radians: number) {
    return radians * 180 / Math.PI
}

function toRadians(degrees: number) {
    return degrees * Math.PI / 180
}

export const RotateToolCached = React.memo<RotateToolProps>(
    (cProps) => {
        if (cProps.visible) {
            return (
                <div className={classes.rotateTool}>
                    <div>
                        <div className={classes.rotateToolSlider}>
                            <div className={classes.rotateToolSliderLabels}>
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
                            <div className={classes.rotateToolSliderBar}>
                                <input type="range" min={-180} max={180} step={0.5} defaultValue={toDegrees(cProps.rotation) + ""}
                                       onChange={e => cProps.onRotationChanged(toRadians(Number(e.target.value)))} list="range-values" />
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
                        </div>
                        <div className={classes.rotateToolSliderFooter}>
                            <Fab className={classes.rotateToolSliderButton} icon={<MaterialIcon icon='close' />} style={{backgroundColor:"#555"}} onClick={() => cProps.onRotationFinished(false, 0)}  />
                            <Fab className={classes.rotateToolSliderButton} icon={<MaterialIcon icon='check' />} onClick={() => cProps.onRotationFinished(true, 0)} />
                        </div>
                    </div>
                </div>
            );
        }
        return (<aside />);
    },
    (prevProps, nextProps) => {
        return prevProps.visible === nextProps.visible;
    }
);

export function RotateTool(props: RotateToolProps) {
    const rotationControlValue = useRef(0)

    function rotateChanged(radians: number) {
        rotationControlValue.current = radians
        props.onRotationChanged(radians)
    }

    function rotateFinished(commit: boolean) {
        props.onRotationFinished(commit, rotationControlValue.current)
    }

    return (
        <RotateToolCached visible={props.visible}
                          rotation={props.rotation}
                          onRotationChanged={rotateChanged}
                          onRotationFinished={rotateFinished} />
    )
}