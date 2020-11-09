import * as React from "react";
import {Fab} from "@material/react-fab";
import '@material/react-fab/dist/fab.css';

import classes from "./EditSurfaceTool.scss";
import MaterialIcon from "@material/react-material-icon";

import {appendClassName} from "../internal/Utils"
import {useCallback} from "react";

type EditSurfaceToolProps = {
    visible: boolean
    className?:string
    undoIcon?:React.ReactElement<HTMLElement>
    redoIcon?:React.ReactElement<HTMLElement>
    cancelIcon?:React.ReactElement<HTMLElement>
    confirmIcon?:React.ReactElement<HTMLElement>
    onEditFinished: (commit: boolean) => void
}

type EditSurfaceToolCachedProps = EditSurfaceToolProps & {
    onUndo: () => void
    onRedo: () => void
}

export const EditSurfaceToolCached = React.memo<EditSurfaceToolCachedProps>(
    (cProps) => {
        if (cProps.visible) {
            let className = appendClassName("edit-surface-tool", classes.editSurfaceTool);
            className = appendClassName(className, cProps.className);

            return (
                <div className={className}>
                    <div className={appendClassName("edit-surface-tool-content", classes.editSurfaceToolContent)}>
                        <div className={appendClassName("edit-surface-tool-slider", classes.editSurfaceToolButtons)}>
                            <Fab className={appendClassName("undo", classes.editSurfaceToolSliderUndo)} icon={cProps.undoIcon ? cProps.undoIcon : <MaterialIcon icon='close'  />} onClick={() => cProps.onUndo()}  />
                            <Fab className={appendClassName("redo", classes.editSurfaceToolSliderRedo)} icon={cProps.redoIcon ? cProps.redoIcon : <MaterialIcon icon='check' />} onClick={() => cProps.onRedo()} />
                        </div>
                        <div className={appendClassName("edit-surface-tool-footer", classes.editSurfaceToolFooter)}>
                            <Fab className={appendClassName("cancel", classes.editSurfaceToolSliderCancel)} icon={cProps.cancelIcon ? cProps.cancelIcon : <MaterialIcon icon='close'  />} onClick={() => cProps.onEditFinished(false)}  />
                            <Fab className={appendClassName("confirm", classes.editSurfaceToolSliderConfirm)} icon={cProps.confirmIcon ? cProps.confirmIcon : <MaterialIcon icon='check' />} onClick={() => cProps.onEditFinished(true)} />
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    },
    (prevProps, nextProps) => {
        return prevProps.visible === nextProps.visible;
    }
);

export function EditSurfaceTool(props: EditSurfaceToolProps) {

    const onUndo = useCallback(() => {
        console.log("undo")
    }, []);

    const onRedo = useCallback(() => {
        console.log("redo")
    }, []);

    return (
        <EditSurfaceToolCached {...props} onUndo={onUndo} onRedo={onRedo} />
    )
}