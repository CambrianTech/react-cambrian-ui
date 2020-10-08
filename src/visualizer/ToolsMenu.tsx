import * as React from "react";

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import {makeStyles} from "@material-ui/core/styles";
import MaterialIcon from "@material/react-material-icon";
import {SpeedDialIcon} from "@material-ui/lab";
import {RotateTool} from "./RotateTool";
import {TranslateTool} from "./TranslateTool";
import {useCallback, useMemo} from "react";
import {CBARSurface, CBARSurfaceAsset} from "react-home-ar";

export enum ToolOperation {
    None='',
    Rotate='rotate',
    Translate='translate',
    DrawSurface='draw',
    EraseSurface='erase',
    ChoosePhoto='choose-photo',
    ChooseScene='choose-scene',
    Share='share',
    ChoosePattern='choose-pattern',
}

export type SimpleToolsMenuProperties = {
    className?:string
    name?:string
    hidden?:boolean
    direction?:'up' | 'down' | 'left' | 'right'
    selectedAsset?:CBARSurfaceAsset|undefined
    selectedSurface?:CBARSurface|undefined
    actions?:ToolsMenuAction[]
    icon?:React.ReactNode,
    openIcon?:React.ReactNode
    onAction:(action:ToolsMenuAction)=>void
}

export type ToolsMenuAction = {
    name:string
    longName?:string|undefined
    icon:React.ReactNode
    operation?:string
    requiresAsset?:boolean
    requiresSurface?:boolean
}

export const DefaultToolsMenuActions:ToolsMenuAction[] = [
    { icon: <MaterialIcon icon='add_a_photo' />, name: 'Photo', longName:'Take Photo', operation:ToolOperation.ChoosePhoto },
    { icon: <MaterialIcon icon='insert_photo' />, name: 'Scene', longName:'Change Scene', operation:ToolOperation.ChooseScene },
    { icon: <MaterialIcon icon='share' />, name: 'Share', longName:'Share Project', operation:ToolOperation.Share },
    { icon: <MaterialIcon icon='rotate_right' />, name: 'Rotate', operation:ToolOperation.Rotate, requiresAsset:true },
    { icon: <MaterialIcon icon='open_with' />, name: 'Move', operation:ToolOperation.Translate, requiresAsset:true },
    { icon: <MaterialIcon icon='view_compact' />, name: 'Pattern', operation:ToolOperation.ChoosePattern, requiresAsset:true },
    { icon: <MaterialIcon icon='edit' />, name: 'Edit Surface', operation:ToolOperation.DrawSurface, requiresSurface:true },
];

export type ToolsMenuProperties = SimpleToolsMenuProperties & {

    initialRotation?:number
    onRotationChanged?: (radians: number) => void
    onRotationFinished?: (commit: boolean, radians:number) => void
    onShowHideButtons: (show: boolean) => void

    initialXPos?:number
    initialYPos?:number
    minTranslation?:[number, number]
    maxTranslation?:[number, number]

    onTranslationChanged?: (xPos: number, yPos: number) => void
    onTranslationFinished?: (commit: boolean, xPos: number, yPos: number) => void
}

const useStyles = makeStyles((theme) => ({
    root: {
        height: 380,
        transform: 'translateZ(0px)',
        flexGrow: 1,
    },
    speedDial: {
        position: 'absolute',
        top: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

export function SimpleToolsMenu(props: SimpleToolsMenuProperties) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const isMobile = window.outerWidth < 400;

    const handleClick = useCallback(() => {
        setOpen(!open);
    }, [open]);

    const handleAction = useCallback((action:ToolsMenuAction) => {
        setOpen(false);
        props.onAction(action);
    }, [props.onAction]);

    const actions = useMemo(()=>{
        let actions:ToolsMenuAction[] = props.actions ? props.actions : DefaultToolsMenuActions;
        if (!props.selectedAsset) {
            actions = actions.filter(action=>!action.requiresAsset);
        }
        if (!props.selectedSurface) {
            actions = actions.filter(action=>!action.requiresSurface);
        }
        return actions;
    }, [props.actions, props.selectedAsset]);

    return (
        <SpeedDial
            hidden={props.hidden}
            direction={props.direction ? props.direction : 'down'}
            icon={<SpeedDialIcon icon={props.icon} openIcon={props.openIcon} />}
            ariaLabel={props.name ? props.name : "Tools"}
            className={classes.speedDial}
            onClick={handleClick}
            open={open}>
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={!isMobile && action.longName ? action.longName : action.name}
                    tooltipOpen
                    onClick={()=>handleAction(action)}
                />
            ))}
        </SpeedDial>
    )
}

export function ToolsMenu(props: ToolsMenuProperties) {

    const [mode, setMode] = React.useState(ToolOperation.None);
    const onShowHideButtons = props.onShowHideButtons;
    const onRotationFinished = props.onRotationFinished;

    const handleAction = (action:ToolsMenuAction) => {

        switch (action.operation) {
            case ToolOperation.Rotate:
            case ToolOperation.Translate:
            case ToolOperation.DrawSurface:
            case ToolOperation.EraseSurface:
                setMode(action.operation);
                break;
            default:
                setMode(ToolOperation.None);
        }

        if (props.onAction) {
            props.onAction(action);
        }
    };

    const rotateFinished = useCallback((finished: boolean, radians:number) => {
        if (onRotationFinished) {
            onRotationFinished(finished, radians)
        }
        setMode(ToolOperation.None);
        onShowHideButtons(true);
    } , [onRotationFinished, onShowHideButtons]);

    const onTranslationFinished = props.onTranslationFinished;
    const translateFinished = useCallback((finished: boolean, xPos:number, yPos:number) => {
        if (onTranslationFinished) {
            onTranslationFinished(finished, xPos, yPos)
        }
        setMode(ToolOperation.None);
        onShowHideButtons(true);
    } , [onTranslationFinished, onShowHideButtons]);

    return (
        <div className={"tools-menu"}>
            <SimpleToolsMenu {...props} onAction={handleAction} />

            {props.onRotationChanged && (
                <RotateTool visible={mode === ToolOperation.Rotate}
                            onRotationFinished={rotateFinished}
                            onRotationChanged={props.onRotationChanged}
                            rotation={props.initialRotation ? props.initialRotation : 0} />
            )}

            {props.onTranslationChanged && (
                <TranslateTool visible={mode === ToolOperation.Translate}
                               onTranslationFinished={translateFinished}
                               onTranslationChanged={props.onTranslationChanged}
                               xPos={props.initialXPos !== undefined ? props.initialXPos : 0}
                               yPos={props.initialYPos !== undefined ? props.initialYPos : 0}
                               min={props.minTranslation} max={props.maxTranslation} />
            )}

        </div>
    )
}