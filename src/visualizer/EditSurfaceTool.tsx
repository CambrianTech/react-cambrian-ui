import * as React from "react";
import classes from "./EditSurfaceTool.scss";
import {appendClassName} from "../internal/Utils"
import {CBARSurface, CBARToolMode} from "react-home-ar";
import {useCallback, useEffect, useRef, useState} from "react";
import {Fab, Icon} from "@material-ui/core";

type EditSurfaceToolProps = {
    className?:string
    toolMode:CBARToolMode
    surface:CBARSurface|undefined
    onToolChanged: (mode: CBARToolMode) => void
    onEditFinished: (success: boolean) => void
    drawLabel?:string
    eraseLabel?:string
}

export const eraserIcon = (<svg style={{width:"24px", height:"24px"}} viewBox="0 0 24 24">
    <path fill="currentColor" d="M16.24,3.56L21.19,8.5C21.97,9.29 21.97,10.55 21.19,11.34L12,20.53C10.44,22.09 7.91,22.09 6.34,20.53L2.81,17C2.03,16.21 2.03,14.95 2.81,14.16L13.41,3.56C14.2,2.78 15.46,2.78 16.24,3.56M4.22,15.58L7.76,19.11C8.54,19.9 9.8,19.9 10.59,19.11L14.12,15.58L9.17,10.63L4.22,15.58Z" />
</svg>);

type ActionButtonProps = {
    label:string
    children:React.ReactElement<HTMLElement>
    selected:boolean
}

const ActionButton = React.memo<ActionButtonProps>(
    (props) => {
        let buttonClassName = appendClassName("edit-surface-tool-action-icon", classes.editSurfaceToolActionIcon);
        if (props.selected) {
            buttonClassName = appendClassName(buttonClassName, "selected");
            buttonClassName = appendClassName(buttonClassName, classes.editSurfaceToolActionIconSelected);
        }
        return (
            <div className={appendClassName("edit-surface-tool-action", classes.editSurfaceToolAction)}>
                <div className={buttonClassName}>
                    {props.children}
                </div>
                <div className={appendClassName("edit-surface-tool-action-label", classes.editSurfaceToolActionLabel)}>
                    {props.label}
                </div>
            </div>
        );
    }
);

export function EditSurfaceTool(props: EditSurfaceToolProps) {

    const [surface, toolMode, onEditFinished, onToolChanged] = [props.surface, props.toolMode, props.onEditFinished, props.onToolChanged];
    const isDrawing = toolMode === CBARToolMode.DrawSurface || toolMode == CBARToolMode.EraseSurface;

    if (!surface || !isDrawing) {
        return null;
    }

    //const canUndo = surface.historyLength > 0;

    let className = appendClassName("edit-surface-tool", classes.editSurfaceTool);
    className = appendClassName(className, props.className);

    const undoLast = useCallback(()=>{
        surface.undoLast();
        setHistoryLength(surface.historyLength);
    }, [surface]);

    const revertChanges = useCallback(()=>{
        surface.revertChanges((success)=>{
            onEditFinished(success);
            if (surface) {
                setHistoryLength(surface.historyLength);
            }
        });
    }, [surface, onEditFinished]);

    const commitChanges = useCallback(()=>{
        surface.commitChanges((success)=>{
            onEditFinished(success);
            setHistoryLength(surface.historyLength);
        });
    }, [surface, onEditFinished]);

    const [historyLength, setHistoryLength] = useState(0);

    const checkTimer = useRef(0);
    const initialize = useCallback(() => {
        checkTimer.current = window.setInterval(()=>{
            setHistoryLength(surface.historyLength);
        }, 1000);
    }, [surface, checkTimer]);

    const initializeRef = useRef(initialize);
    useEffect(() => { initializeRef.current = initialize; }, [initialize]);

    useEffect(() => {
        if (initializeRef.current) {
            initializeRef.current()
        }
        return ()=>{
            if (checkTimer.current) {
                window.clearInterval(checkTimer.current);
            }
        }
    }, []);

    return (
        <div className={className}>
            <div className={appendClassName("edit-surface-tool-content", classes.editSurfaceToolContent)}>
                <div className={appendClassName("edit-surface-tool-actions", classes.editSurfaceToolActions)}>
                    <ActionButton selected={toolMode===CBARToolMode.DrawSurface} label={props.drawLabel ? props.drawLabel : "Fill In"}>
                        <Fab className={appendClassName("edit-surface-tool-draw", classes.editSurfaceToolDraw)} onClick={() => onToolChanged(CBARToolMode.DrawSurface)}>
                            <Icon>brush</Icon>
                        </Fab>
                    </ActionButton>
                    <ActionButton selected={toolMode===CBARToolMode.EraseSurface} label={props.eraseLabel ? props.eraseLabel : "Erase"}>
                        <Fab className={appendClassName("edit-surface-tool-erase", classes.editSurfaceToolErase)} onClick={() => onToolChanged(CBARToolMode.EraseSurface)}>
                            {eraserIcon}
                        </Fab>
                    </ActionButton>
                </div>
                <div className={appendClassName("edit-surface-tool-primary-buttons", classes.editSurfaceToolPrimaryButtons)}>
                    <div className={appendClassName("edit-surface-tool-button", classes.editSurfaceToolButton)}>
                        <Fab disabled={historyLength === 0} className={appendClassName("edit-surface-tool-undo", classes.editSurfaceToolUndo)} onClick={()=>undoLast()}>
                            <Icon>undo</Icon>
                        </Fab>
                    </div>
                    <div className={appendClassName("edit-surface-tool-button", classes.editSurfaceToolButton)}>
                        <Fab className={appendClassName("edit-surface-tool-cancel", classes.editSurfaceToolCancel)} onClick={()=>revertChanges()}>
                            <Icon>close</Icon>
                        </Fab>
                    </div>
                    <div className={appendClassName("edit-surface-tool-button", classes.editSurfaceToolButton)}>
                        <Fab className={appendClassName("edit-surface-tool-confirm", classes.editSurfaceToolConfirm)} onClick={()=>commitChanges()}>
                            <Icon>check</Icon>
                        </Fab>
                    </div>
                </div>
            </div>
        </div>
    );
}