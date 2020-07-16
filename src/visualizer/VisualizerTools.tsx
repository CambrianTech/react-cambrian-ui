import * as React from "react";
import {Fab} from "@material/react-fab";
import '@material/react-fab/dist/fab.css';
import {useCallback, useMemo} from "react";
import {CBARTangibleAsset, CBARTiledAsset, TiledGridType} from "react-home-ar";
import MaterialIcon from "@material/react-material-icon";
import {RotateTool} from "./RotateTool";
import classes from "./VisualizerTools.scss";
import {appendClassName} from "../internal/Utils"
import {TranslateTool} from "./TranslateTool";
import {TiledGridSelector} from "./TiledGridSelector";

export enum VisualizerToolMode {
    None,
    ChoosePhoto,
    ChooseScene,
    Rotate,
    Translate,
    Pattern,
    DrawSurface,
    EraseSurface
}

type VisualizerToolsProperties = {

    visible:boolean
    className?:string

    mode:VisualizerToolMode
    customModes?:string[]

    isModePermitted:(mode:VisualizerToolMode)=>boolean;
    selectedAsset?:CBARTangibleAsset|undefined
    historySize?:number

    onShowHideButtons: (show: boolean) => void

    initialRotation?:number
    onRotationChanged?: (radians: number) => void
    onRotationFinished?: (commit: boolean, radians:number) => void

    initialXPos?:number
    initialYPos?:number
    minTranslation?:number
    maxTranslation?:number

    onTranslationChanged?: (xPos: number, yPos: number) => void
    onTranslationFinished?: (commit: boolean, xPos: number, yPos: number) => void

    patternSelectorImagePath?: (name:string, type: TiledGridType) => string
    patternSelectorRestrictToProducts?: boolean

    changeMode: (mode:VisualizerToolMode) => void
}

type VisualizerToolsCachedProps = VisualizerToolsProperties & {
    rotateButtonClicked: ()=>void
    rotateFinished:(finished: boolean, radians:number)=>void

    translateButtonClicked: ()=>void
    translateFinished:(finished: boolean, xPos:number, yPos:number)=>void

    hasPatterns:boolean
    tiledAsset:CBARTiledAsset|undefined
    patternButtonClicked: ()=>void
}

export const VisualizerToolsCached = React.memo<VisualizerToolsCachedProps>(
    (props) => {
        if (props.visible) {

            let className = appendClassName("visualizer-tools", classes.visualizerTools)
            className = appendClassName(className, props.className)

            const buttonsVisible = props.mode !== VisualizerToolMode.Rotate && props.mode !== VisualizerToolMode.Translate && props.mode !== VisualizerToolMode.Pattern;

            return (
                <div className={className}>

                    {buttonsVisible && <div className={appendClassName("visualizer-tools-buttons", classes.visualizerToolsButtons)}>
                        {props.isModePermitted(VisualizerToolMode.ChoosePhoto) && <Fab className={classes.toolButton} onClick={()=>props.changeMode(VisualizerToolMode.ChoosePhoto)} icon={<MaterialIcon icon='add_a_photo' />} />}
                        {props.isModePermitted(VisualizerToolMode.ChooseScene) && <Fab className={classes.toolButton} onClick={()=>props.changeMode(VisualizerToolMode.ChooseScene)} icon={<MaterialIcon icon='insert_photo' />} />}
                        {props.isModePermitted(VisualizerToolMode.Rotate) && <Fab className={classes.toolButton} onClick={props.rotateButtonClicked} icon={<MaterialIcon icon='rotate_right' className={classes.rotateToolIcon} />} />}
                        {props.isModePermitted(VisualizerToolMode.Translate) && <Fab className={classes.toolButton} onClick={props.translateButtonClicked} icon={<MaterialIcon icon='open_with'  className={classes.moveToolIcon} />} />}
                        {props.hasPatterns && <Fab className={classes.toolButton} onClick={props.patternButtonClicked} icon={<MaterialIcon icon='view_compact'  className={classes.patternToolIcon} />} />}
                        {props.isModePermitted(VisualizerToolMode.DrawSurface) && props.isModePermitted(VisualizerToolMode.EraseSurface) && <Fab className={classes.toolButton} icon={<MaterialIcon icon='edit' />} />}
                    </div>}

                    {props.onRotationChanged && (
                        <RotateTool visible={props.mode === VisualizerToolMode.Rotate}
                                    onRotationFinished={props.rotateFinished}
                                    onRotationChanged={props.onRotationChanged}
                                    rotation={props.initialRotation ? props.initialRotation : 0} />
                    )}

                    {props.onTranslationChanged && (
                        <TranslateTool visible={props.mode === VisualizerToolMode.Translate}
                                       onTranslationFinished={props.translateFinished}
                                       onTranslationChanged={props.onTranslationChanged}
                                       xPos={props.initialXPos !== undefined ? props.initialXPos : 0}
                                       yPos={props.initialYPos !== undefined ? props.initialYPos : 0}
                                       min={props.minTranslation} max={props.maxTranslation} />
                    )}

                    {props.patternSelectorImagePath && (
                        <TiledGridSelector visible={props.mode === VisualizerToolMode.Pattern}
                                           resolveImagePath={props.patternSelectorImagePath}
                                           tiledAsset={props.tiledAsset}
                                           onClose={props.patternButtonClicked}
                                           timeout={2000}
                                           restrictToProduct={props.patternSelectorRestrictToProducts} />
                    )}
                </div>
            );
        }
        return null;
    }
);

export function VisualizerTools(props: VisualizerToolsProperties) {

    const onShowHideButtons = props.onShowHideButtons

    const onRotationFinished = props.onRotationFinished
    const rotateFinished = useCallback((finished: boolean, radians:number) => {
        onShowHideButtons(true)
        if (onRotationFinished) {
            onRotationFinished(finished, radians)
        }
        props.changeMode(VisualizerToolMode.None)
    } , [onRotationFinished, onShowHideButtons, props]);

    const rotateButtonClicked = useCallback(() => {
        props.changeMode(VisualizerToolMode.Rotate)
    } , [props]);

    const onTranslationFinished = props.onTranslationFinished
    const translateFinished = useCallback((finished: boolean, xPos:number, yPos:number) => {
        onShowHideButtons(true)
        if (onTranslationFinished) {
            onTranslationFinished(finished, xPos, yPos)
        }
        props.changeMode(VisualizerToolMode.None)
    } , [onTranslationFinished, onShowHideButtons, props]);

    const translateButtonClicked = useCallback(() => {
        props.changeMode(VisualizerToolMode.Translate)
    } , [props]);

    const patternButtonClicked = useCallback(() => {
        props.changeMode(props.mode === VisualizerToolMode.Pattern ? VisualizerToolMode.None : VisualizerToolMode.Pattern)
    } , [props]);

    const tiledAsset = props.selectedAsset && props.selectedAsset instanceof CBARTiledAsset ? props.selectedAsset as CBARTiledAsset : undefined

    const hasPatterns = useMemo(()=>{
        if (!tiledAsset || !props.isModePermitted(VisualizerToolMode.Pattern)) return false

        if (props.patternSelectorRestrictToProducts) {
            return tiledAsset.product ? tiledAsset.product.patterns.length > 1 : false
        }

        return true
    }, []);

    return (
        <div>
            <VisualizerToolsCached
                {...props}
                rotateButtonClicked = {rotateButtonClicked}
                rotateFinished = {rotateFinished}
                translateButtonClicked = {translateButtonClicked}
                translateFinished = {translateFinished}
                hasPatterns = {hasPatterns}
                tiledAsset = {tiledAsset}
                patternButtonClicked = {patternButtonClicked}
            />
        </div>
    )
}