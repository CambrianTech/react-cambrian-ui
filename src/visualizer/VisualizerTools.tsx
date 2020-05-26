import * as React from "react";
import {Fab} from "@material/react-fab";
import '@material/react-fab/dist/fab.css';
import {useCallback} from "react";
import {CBARAsset, CBARContext, CBARSurface, CBARTangibleAsset} from "react-home-ar";
import MaterialIcon from "@material/react-material-icon";
import {RotateTool} from "./RotateTool";
import classes from "./VisualizerTools.scss";
import {appendClassName} from "../internal/Utils"

export enum VisualizerToolMode {
    None,
    Rotate,
    Translate,
    Draw,
    Erase
}

type VisualizerToolsProperties = {
    context:CBARContext | undefined
    selectedAsset:CBARTangibleAsset | undefined
    selectedSurface:CBARSurface | undefined

    visible:boolean
    className?:string

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

    const translateButtonClicked = useCallback(() => {
        props.changeMode(VisualizerToolMode.Translate)
    } , [props]);

    let className = appendClassName("visualizer-tools", classes.visualizerTools)
    className = appendClassName(className, props.className)

    return (
        <div>
            {props.visible && props.context && (
                <div className={className}>
                    <Fab className={classes.toolButton} onClick={onChangeImage} icon={<MaterialIcon icon='add_a_photo' />} />
                    {props.selectedAsset && props.selectedAsset.canMove && <Fab className={classes.toolButton} onClick={rotateButtonClicked} icon={<MaterialIcon icon='rotate_right' className={classes.rotateToolIcon} />} />}
                    {props.selectedAsset && props.selectedAsset.canMove && <Fab className={classes.toolButton} onClick={translateButtonClicked} icon={<MaterialIcon icon='open_with'  className={classes.moveToolIcon} />} />}
                    {props.selectedSurface && currentScene && currentScene.isEditable && <Fab className={classes.toolButton} icon={<MaterialIcon icon='edit' />} />}

                    <RotateTool visible={props.mode === VisualizerToolMode.Rotate}
                                onRotationFinished={rotateFinished}
                                onRotationChanged={props.onRotationChanged}
                                rotation={props.initialRotation} />
                </div>
            )}
        </div>
    )
}