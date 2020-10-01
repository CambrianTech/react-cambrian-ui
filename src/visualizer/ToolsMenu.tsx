import * as React from "react";

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import {makeStyles} from "@material-ui/core/styles";
import MaterialIcon from "@material/react-material-icon";

type ToolsMenuProperties = {
    className?:string
    hidden?:boolean
    direction?:'up' | 'down' | 'left' | 'right'
    actions?:ToolsMenuAction[]
    icon?:React.ReactNode
}

export type ToolsMenuAction = {
    name:string
    longName?:string|undefined
    icon:React.ReactNode
}

export const ToolsMenuDefaultActions:ToolsMenuAction[] = [
    { icon: <MaterialIcon icon='add_a_photo' />, name: 'Photo', longName:'Take Photo' },
    { icon: <MaterialIcon icon='insert_photo' />, name: 'Scene', longName:'Change Scene' },
    { icon: <MaterialIcon icon='share' />, name: 'Share', longName:'Share Project' },
    { icon: <MaterialIcon icon='rotate_right' />, name: 'Rotate' },
    { icon: <MaterialIcon icon='open_with' />, name: 'Move' },
    { icon: <MaterialIcon icon='view_compact' />, name: 'Pattern' },
    { icon: <MaterialIcon icon='edit' />, name: 'Edit Surface' },
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
    const actions = props.actions ? props.actions : ToolsMenuDefaultActions;
    const isMobile = window.outerWidth < 400;

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    return (
        <SpeedDial
            direction={props.direction ? props.direction : 'down'}
            ariaLabel="Visualizer Tools"
            className={classes.speedDial}
            hidden={props.hidden}
            icon={props.icon ? props.icon : <SpeedDialIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}>
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={!isMobile && action.longName ? action.longName : action.name}
                    tooltipOpen
                    onClick={handleClose}
                />
            ))}
        </SpeedDial>
    )
}