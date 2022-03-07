import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import {CBARContext, ZoomState} from "react-home-ar";
import classes from "./VisualizerTools.scss";
import {Fab, Icon} from "@mui/material";

type ZoomControlsProps = {
    hidden?: boolean
    className?:string
    context: CBARContext|undefined|null
    mode?:'single'|'complex'
}

const scaleBy = 1.5

export function ZoomControls(props: ZoomControlsProps) {

    const context = props.context
    const [currentState, setCurrentState] = useState<ZoomState>();

    const zoom = useCallback((out:boolean)=>{
        if (context) {
            if (out) {
                context.zoomScale = Math.min(context.zoomScale / scaleBy, context.zoomScale - 1);
            } else {
                context.zoomScale = Math.max(context.zoomScale * scaleBy, context.zoomScale + 1);
            }
        }
    }, [context]);

    const setZoomState = useCallback((state:ZoomState)=>{
        if (context) {
            context.zoomState = state
        }
    }, [context]);

    const refreshState = useCallback(()=>{
        if (context) {
            setCurrentState(context.zoomState);
        }
    }, [context]);

    const interval = useRef(0);

    useEffect(() => {
        //todo, wire up events in react-home-ar to enable watching their state rather than polling it:
        interval.current = window.setInterval(refreshState, 250);
        return () => {
            window.clearInterval(interval.current)
        }
    }, [refreshState, interval]);

    let className = classes.zoomControls + ' zoom-controls';
    if (props.className) {
        className += ` ${props.className}`
    }

    if (props.mode == 'complex') {
        return (
            <div className={className}>
                <Fab onClick={()=>zoom(false)}>
                    <Icon>zoom_in</Icon>
                </Fab>
                <Fab onClick={()=>zoom(true)}>
                    <Icon>zoom_out</Icon>
                </Fab>
                <Fab onClick={()=>setZoomState(ZoomState.FitScreen)}>
                    <Icon>fit_screen</Icon>
                </Fab>
            </div>
        )
    } else {
        return (
            <div className={className}>
                <Fab className={"MuiFab-primary"} onClick={()=>setZoomState(currentState === ZoomState.FitScreen ? ZoomState.ZoomedOut : ZoomState.FitScreen)}>
                    <Icon>{currentState === ZoomState.FitScreen ? "zoom_out" : "fit_screen"}</Icon>
                </Fab>
            </div>
        )
    }
}