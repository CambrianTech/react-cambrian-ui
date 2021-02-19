import * as React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {SpeedDial, SpeedDialAction, SpeedDialIcon} from "@material-ui/lab";
import {useCallback, useMemo} from "react";
import {CBARSurface, CBARSurfaceAsset, CBARTiledAsset, CBARToolMode} from "react-home-ar";
import {Icon} from "@material-ui/core";

export enum ToolOperation {
    Remove='remove',
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
    { icon: <Icon>clear</Icon>, name: 'Remove', longName:'Remove', operation:ToolOperation.Remove, requiresAsset:true },
    { icon: <Icon>add_a_photo</Icon>, name: 'Photo', operation:ToolOperation.ChoosePhoto },
    { icon: <Icon>insert_photo</Icon>, name: 'Scene', longName:'Change Scene', operation:ToolOperation.ChooseScene },
    { icon: <Icon>share</Icon>, name: 'Share', longName:'Share Project', operation:ToolOperation.Share },
    { icon: <Icon>rotate_right</Icon>, name: 'Rotate', operation:CBARToolMode.Rotate, requiresAsset:true },
    { icon: <Icon>open_with</Icon>, name: 'Move', operation:CBARToolMode.Translate, requiresAsset:true },
    { icon: <Icon>view_compact</Icon>, name: 'Pattern', operation:ToolOperation.ChoosePattern, requiresAsset:true },
    { icon: <Icon>edit</Icon>, name: 'Edit Surface', operation:CBARToolMode.DrawSurface, requiresSurface:true },
];

const useStyles = makeStyles((theme) => ({
    speedDial: {
        position: 'absolute',
        top: theme.spacing(2),
        right: theme.spacing(2),
    },
    staticTooltip: {
        whiteSpace:"nowrap"
    }
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
        if (props.selectedAsset) {
            if (!props.selectedAsset.canMove) {
                actions = actions.filter(action=>action.operation !== CBARToolMode.Rotate && action.operation !== CBARToolMode.Translate);
            }
            if (!(props.selectedAsset instanceof CBARTiledAsset)) {
                actions = actions.filter(action=>action.operation !== ToolOperation.ChoosePattern);
            }
        } else {
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
            className={`${props.className} ${classes.speedDial}`}
            onClick={handleClick}
            open={open}>
            {actions.map((action) => (
                <SpeedDialAction
                    classes={{ staticTooltip: classes.staticTooltip }}
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