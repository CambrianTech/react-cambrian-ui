import * as React from "react";

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import {makeStyles} from "@material-ui/core/styles";
import MaterialIcon from "@material/react-material-icon";
import {SpeedDialIcon} from "@material-ui/lab";
import {RotateTool} from "./RotateTool";
import {TranslateTool} from "./TranslateTool";
import {useCallback} from "react";

export enum ToolMode {
    None='',
    Rotate='rotate',
    Translate='translate',
    DrawSurface='draw',
    EraseSurface='erase'
}

export type SimpleToolsMenuProperties = {
    className?:string
    hidden?:boolean
    direction?:'up' | 'down' | 'left' | 'right'
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
}

export const ToolsMenuDefaultActions:ToolsMenuAction[] = [
    { icon: <MaterialIcon icon='add_a_photo' />, name: 'Photo', longName:'Take Photo' },
    { icon: <MaterialIcon icon='insert_photo' />, name: 'Scene', longName:'Change Scene' },
    { icon: <MaterialIcon icon='share' />, name: 'Share', longName:'Share Project' },
    { icon: <MaterialIcon icon='rotate_right' />, name: 'Rotate', operation:ToolMode.Rotate },
    { icon: <MaterialIcon icon='open_with' />, name: 'Move', operation:ToolMode.Translate },
    { icon: <MaterialIcon icon='view_compact' />, name: 'Pattern' },
    { icon: <MaterialIcon icon='edit' />, name: 'Edit Surface', operation:ToolMode.DrawSurface },
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
    const actions = props.actions ? props.actions : ToolsMenuDefaultActions;
    const isMobile = window.outerWidth < 400;

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAction = (action:ToolsMenuAction) => {
        setOpen(false);
        props.onAction(action);
    };

    return (
        <SpeedDial
            hidden={props.hidden}
            direction={props.direction ? props.direction : 'down'}
            icon={<SpeedDialIcon icon={props.icon} openIcon={props.openIcon} />}
            ariaLabel="Visualizer Tools"
            className={classes.speedDial}
            onClose={handleClose}
            onOpen={handleOpen}
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

    const [mode, setMode] = React.useState(ToolMode.None);
    const onShowHideButtons = props.onShowHideButtons;
    const onRotationFinished = props.onRotationFinished;

    const handleAction = (action:ToolsMenuAction) => {

        switch (action.operation) {
            case ToolMode.Rotate:
                setMode(ToolMode.Rotate);
                break;
            case ToolMode.Translate:
                setMode(ToolMode.Translate);
                break;
            case ToolMode.DrawSurface:
                setMode(ToolMode.DrawSurface);
                break;
            default:
                setMode(ToolMode.None);
        }

        if (props.onAction) {
            props.onAction(action);
        }
    };

    const rotateFinished = useCallback((finished: boolean, radians:number) => {
        if (onRotationFinished) {
            onRotationFinished(finished, radians)
        }
        setMode(ToolMode.None);
        onShowHideButtons(true);
    } , [onRotationFinished, onShowHideButtons]);

    const onTranslationFinished = props.onTranslationFinished;
    const translateFinished = useCallback((finished: boolean, xPos:number, yPos:number) => {
        if (onTranslationFinished) {
            onTranslationFinished(finished, xPos, yPos)
        }
        setMode(ToolMode.None);
        onShowHideButtons(true);
    } , [onTranslationFinished, onShowHideButtons]);

    return (
        <div className={"tools-menu"}>
            <SimpleToolsMenu {...props} onAction={handleAction} />

            {props.onRotationChanged && (
                <RotateTool visible={mode === ToolMode.Rotate}
                            onRotationFinished={rotateFinished}
                            onRotationChanged={props.onRotationChanged}
                            rotation={props.initialRotation ? props.initialRotation : 0} />
            )}

            {props.onTranslationChanged && (
                <TranslateTool visible={mode === ToolMode.Translate}
                               onTranslationFinished={translateFinished}
                               onTranslationChanged={props.onTranslationChanged}
                               xPos={props.initialXPos !== undefined ? props.initialXPos : 0}
                               yPos={props.initialYPos !== undefined ? props.initialYPos : 0}
                               min={props.minTranslation} max={props.maxTranslation} />
            )}

        </div>
    )
}