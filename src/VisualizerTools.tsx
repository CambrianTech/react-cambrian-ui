import * as React from "react";
import {Fab} from "@material/react-fab";
import '@material/react-fab/dist/fab.css';
import {useState, useCallback} from "react";
import {CBARAsset, CBARSurface} from "react-home-ar";
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

    mode:VisualizerToolMode
    historySize:number

    onChangeImage:()=>void
    onShowHideButtons: (show: boolean) => void

    selectedSurface?:CBARSurface
    selectedAsset?:CBARAsset

    initialRotation:number
    onRotationChanged: (radians: number) => void
    onRotationFinished: (commit: boolean, radians:number) => void

    editAreaEnabled?:boolean

    onModeChanged: (mode:VisualizerToolMode) => void
}

export function VisualizerTools(props: VisualizerToolsProperties) {

    const [isOpen, setIsOpen] = useState<boolean>()
    //const siteContext = useContext(SiteContext)!

    const onChangeImage = useCallback((e:any) => {
        props.onChangeImage()
    }, [props])

    const onShowHideButtons = props.onShowHideButtons
    const onRotationFinished = props.onRotationFinished

    const toggleTools = useCallback(() => {
        const open = !isOpen
        setIsOpen(open)
    } , [isOpen]);

    const rotateFinished = useCallback((finished: boolean, radians:number) => {
        onShowHideButtons(true)
        onRotationFinished(finished, radians)
        props.onModeChanged(VisualizerToolMode.None)
    } , [onRotationFinished, onShowHideButtons, props]);

    const rotateButtonClicked = useCallback(() => {
        toggleTools()
        props.onModeChanged(VisualizerToolMode.None)
    } , [props, toggleTools]);

    return (
        <div className={classes.visualizerTools}>

            {props.visible && <Fab className={classes.toolButton} onClick={onChangeImage} icon={<MaterialIcon icon='add_a_photo' />} />}
            {props.visible && <Fab className={classes.toolButton} onClick={rotateButtonClicked} icon={<MaterialIcon icon='rotate_right' />} />}
            {props.visible && props.editAreaEnabled && <Fab className={classes.toolButton} icon={<MaterialIcon icon='edit' />} />}

            <RotateTool visible={props.mode === VisualizerToolMode.Rotate}
                        onRotationFinished={rotateFinished}
                        onRotationChanged={props.onRotationChanged}
                        rotation={props.initialRotation} />
        </div>
    )
}