import * as React from "react";
import {Button, Icon} from "@material-ui/core";
import {ApiCapabilityName} from "cambrian-base";
import classes from "./PickImageSource.scss";

type PickImageSourceProps = {
    visible: boolean
    className?: string
    hasScenes: boolean
    hasUpload: boolean
    sourceChosen:(source:ApiCapabilityName)=>void
    chooseText?:string
    uploadText?:string
}

const PickImageSourceCached = React.memo<PickImageSourceProps>(
    (props) => {
        return (
            <div className={classes.chooseScene} style={{visibility:props.visible ? "visible":"hidden"}}>
                <div className={classes.content}>
                    {props.hasScenes && <Button variant="contained" color="primary" onClick={()=>props.sourceChosen('scenes')}>
                        <div className={classes.buttonContent}>
                            <Icon className={classes.buttonIcon}>insert_photo</Icon>
                            <div className={classes.buttonText}>{props.chooseText ? props.chooseText : "Choose Scene"}</div>
                        </div>
                    </Button>}
                    {props.hasUpload && <Button variant="contained" color="secondary" onClick={()=>props.sourceChosen('upload')}>
                        <div className={classes.buttonContent}>
                            <Icon className={classes.buttonIcon}>add_a_photo</Icon>
                            <div className={classes.buttonText}>{props.uploadText ? props.uploadText : "Upload Photo"}</div>
                        </div>
                    </Button>}
                </div>
            </div>
        );
    }
);

export function PickImageSource(props: PickImageSourceProps) {
    return (
        <PickImageSourceCached {...props} />
    )
}