import * as React from "react";
import {Fab} from "@material/react-fab";
import '@material/react-fab/dist/fab.css';
import {useState, useCallback, useEffect} from "react";
import {CBARContext} from "react-home-ar";
import MaterialIcon from "@material/react-material-icon";
import {RotateTool} from "./RotateTool";
import classes from "./VisualizerTools.scss";

export enum VisualizerToolMode {
    None,
    Rotate,
    Draw,
    Erase
}

type VisualizerToolsProperties = {
    visible:boolean

    context:CBARContext|undefined

    mode:VisualizerToolMode
    historySize:number

    onChangeImage:()=>void
    onShowHideButtons: (show: boolean) => void

    initialRotation:number
    onRotationChanged: (radians: number) => void
    onRotationFinished: (commit: boolean, radians:number) => void

    changeMode: (mode:VisualizerToolMode) => void
}

export function VisualizerTools(props: VisualizerToolsProperties) {


    const currentScene = props.context ? props.context.getScene() : undefined

    const onChangeImage = useCallback((e:any) => {
        props.onChangeImage()
    }, [props])

    const onShowHideButtons = props.onShowHideButtons
    const onRotationFinished = props.onRotationFinished

    const rotateFinished = useCallback((finished: boolean, radians:number) => {
        onShowHideButtons(true)
        onRotationFinished(finished, radians)
        props.changeMode(VisualizerToolMode.None)
    } , [onRotationFinished, onShowHideButtons, props]);

    const rotateButtonClicked = useCallback(() => {
        props.changeMode(VisualizerToolMode.Rotate)
    } , [props]);

    return (
        <div>
            {props.visible && props.context && (
                <div className={classes.visualizerTools}>
                    <Fab className={classes.toolButton} onClick={onChangeImage} icon={<MaterialIcon icon='add_a_photo' />} />
                    {currentScene && <Fab className={classes.toolButton} onClick={rotateButtonClicked} icon={<MaterialIcon icon='rotate_right' />} />}
                    {currentScene && currentScene.isEditable && <Fab className={classes.toolButton} icon={<MaterialIcon icon='edit' />} />}

                    <RotateTool visible={props.mode === VisualizerToolMode.Rotate}
                                onRotationFinished={rotateFinished}
                                onRotationChanged={props.onRotationChanged}
                                rotation={props.initialRotation} />
                </div>
            )}
        </div>
    )
}