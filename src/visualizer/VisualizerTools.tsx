import * as React from "react";
import {Fab} from "@material/react-fab";
import '@material/react-fab/dist/fab.css';
import {useCallback} from "react";
import {CBARContext, CBARSurface, CBARTangibleAsset, CBARTiledAsset, TiledGridType} from "react-home-ar";
import MaterialIcon from "@material/react-material-icon";
import {RotateTool} from "./RotateTool";
import classes from "./VisualizerTools.scss";
import {appendClassName} from "../internal/Utils"
import {TranslateTool} from "./TranslateTool";
import {TiledGridSelector} from "./TiledGridSelector";

export enum VisualizerToolMode {
    None,
    Rotate,
    Translate,
    Pattern,
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

    patternSelectorImagePath?: (name:string, type: TiledGridType) => string
    patternSelectorRestrictToProducts?: boolean

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

    const patternButtonClicked = useCallback(() => {
        props.changeMode(props.mode === VisualizerToolMode.Pattern ? VisualizerToolMode.None : VisualizerToolMode.Pattern)
    } , [props]);

    let className = appendClassName("visualizer-tools", classes.visualizerTools)
    className = appendClassName(className, props.className)

    const tiledAsset = props.selectedAsset && props.selectedAsset instanceof CBARTiledAsset ? props.selectedAsset as CBARTiledAsset : undefined
    const product = props.selectedAsset ? props.selectedAsset.product : undefined

    const canMove = props.selectedAsset && props.selectedAsset.canMove;
    const canRotate = props.selectedAsset && props.selectedAsset.canMove;

    const canEditPattern = tiledAsset && product
    const canEditSurface = props.selectedSurface && currentScene && currentScene.isEditable;

    return (
        <div>
            {props.visible && props.context && (
                <div className={className}>
                    <Fab className={classes.toolButton} onClick={onChangeImage} icon={<MaterialIcon icon='add_a_photo' />} />
                    {canMove && <Fab className={classes.toolButton} onClick={rotateButtonClicked} icon={<MaterialIcon icon='rotate_right' className={classes.rotateToolIcon} />} />}
                    {canRotate && <Fab className={classes.toolButton} onClick={translateButtonClicked} icon={<MaterialIcon icon='open_with'  className={classes.moveToolIcon} />} />}
                    {canEditPattern && <Fab className={classes.toolButton} onClick={patternButtonClicked} icon={<MaterialIcon icon='view_compact'  className={classes.patternToolIcon} />} />}
                    {canEditSurface && <Fab className={classes.toolButton} icon={<MaterialIcon icon='edit' />} />}

                    <RotateTool visible={props.mode === VisualizerToolMode.Rotate}
                                onRotationFinished={rotateFinished}
                                onRotationChanged={props.onRotationChanged}
                                rotation={props.initialRotation} />

                    <TranslateTool visible={props.mode === VisualizerToolMode.Translate}
                                   onTranslationFinished={translateFinished}
                                   onTranslationChanged={props.onTranslationChanged}
                                   xPos={props.initialXPos} yPos={props.initialYPos} />

                    <TiledGridSelector visible={props.mode === VisualizerToolMode.Pattern}
                                       resolveImagePath={props.patternSelectorImagePath!}
                                       tiledAsset={tiledAsset}
                                       onClose={patternButtonClicked}
                                       timeout={2000}
                                       restrictToProduct={props.patternSelectorRestrictToProducts} />
                </div>
            )}
        </div>
    )
}