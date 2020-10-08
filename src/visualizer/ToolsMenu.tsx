import * as React from "react";

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import {makeStyles} from "@material-ui/core/styles";
import MaterialIcon from "@material/react-material-icon";
import {SpeedDialIcon} from "@material-ui/lab";
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

export type ToolsMenuProperties = {
    className?:string
    name?:string
    hidden?:boolean
    direction?:'up' | 'down' | 'left' | 'right'

    onAction:(action:ToolsMenuAction)=>void

    selectedAsset?:CBARSurfaceAsset|undefined
    selectedSurface?:CBARSurface|undefined
    actions?:ToolsMenuAction[]
    icon?:React.ReactNode,
    openIcon?:React.ReactNode
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

export function ToolsMenu(props: ToolsMenuProperties) {
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