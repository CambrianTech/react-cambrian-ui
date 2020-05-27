import * as React from "react";
import {Fab} from "@material/react-fab";
import '@material/react-fab/dist/fab.css';
import {useCallback} from "react";
import {CBARContext, CBARSurface, CBARTangibleAsset} from "react-home-ar";
import MaterialIcon from "@material/react-material-icon";
import {RotateTool} from "./RotateTool";
import classes from "./VisualizerTools.scss";
import {appendClassName} from "../internal/Utils"
import {TranslateTool} from "./TranslateTool";

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

    initialXPos:number
    initialYPos:number
    onTranslationChanged: (xPos: number, yPos: number) => void
    onTranslationFinished: (commit: boolean, xPos: number, yPos: number) => void

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

    const onTranslationFinished = props.onTranslationFinished
    const translateFinished = useCallback((finished: boolean, xPos:number, yPos:number) => {
        onShowHideButtons(true)
        onTranslationFinished(finished, xPos, yPos)
        props.changeMode(VisualizerToolMode.None)
    } , [onTranslationFinished, onShowHideButtons, props]);

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

                    <TranslateTool visible={props.mode === VisualizerToolMode.Translate}
                                   onTranslationFinished={translateFinished}
                                   onTranslationChanged={props.onTranslationChanged}
                                   xPos={props.initialXPos} yPos={props.initialYPos} />
                </div>
            )}
        </div>
    )
}