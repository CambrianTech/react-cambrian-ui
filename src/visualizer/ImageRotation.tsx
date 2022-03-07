import React, {createRef, useCallback, useEffect, useState} from "react"
import './ImageRotation.scss'
import {appendClassName} from "../internal/Utils";
import classes from "./ImageRotation.scss";
import {Fab, Icon} from "@mui/material";

interface ImageRotationProperties {
    className?: string,
    imageUrl?:string,
    onFinished:(result:string, useChanges:boolean)=>void
}

export function ImageRotation(props: ImageRotationProperties) {

    const [image, setImage] = useState<HTMLImageElement>();
    const previewImage = createRef<HTMLImageElement>();
    const [currentImageSource, setCurrentImageSource] = useState<string>();
    const [numRotations, setNumRotations] = useState(0);

    const showPopup = useCallback((show: boolean) => {
        const self = document.getElementById("image-rotation-popup");
        if (!self) return;

        if (show) {
            self.classList.remove('md-hide');
            self.classList.add('md-show')
        } else {
            self.classList.remove('md-show');
            self.classList.add('md-hide')
        }
    }, []);

    const rotateImage = useCallback((rotation:number) => {

        const totalRotations = (rotation + numRotations + 4) % 4;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext("2d");

        if (!ctx || !props.imageUrl) return;

        const img = new Image();
        img.src = props.imageUrl;

        img.onload = ()=>{
            const width = img.width;
            const height = img.height;

            if (totalRotations % 2 === 1) {
                canvas.width = height;
                canvas.height = width;
            } else {
                canvas.width = width;
                canvas.height = height;
            }

            switch (totalRotations) {
                case 1:
                    ctx.transform(0, 1, -1, 0, img.height, 0);
                    break;
                case 2:
                    ctx.transform(-1, 0, 0, -1, img.width, img.height);
                    break;
                case 3:
                    ctx.transform(0, -1, 1, 0, 0, img.width);
                    break;
                default:
                    ctx.transform(1, 0, 0, 1, 0, 0);
            }

            ctx.drawImage(img, 0, 0, width, height);

            const transformed = canvas.toDataURL("image/png");

            setCurrentImageSource(transformed);
            setNumRotations(totalRotations);

            setImage(img)
        }

    }, [numRotations, props.imageUrl]);

    const finished = useCallback((useChanges: boolean) => {
        if (!image) return;

        showPopup(false);
        setImage(undefined);

        if (currentImageSource) {
            props.onFinished(currentImageSource, useChanges)
        }

    }, [currentImageSource, image, props, showPopup]);

    useEffect(() => {
        if (props.imageUrl && !image) {

            const img = new Image();
            img.src = props.imageUrl;
            img.onload = ()=>{
                setImage(img);
                setCurrentImageSource(props.imageUrl);
                showPopup(true)
            }
        }
    }, [image, props.imageUrl, showPopup]);

    let className = classes.imageRotation + ' image-rotation-popup md-modal md-effect-12';
    if (props.className) {
        className += ` ${props.className}`
    }

    return (
        <div>
            {props.imageUrl && <div id={"image-rotation-popup"} className={className}>
                <div className="md-content">
                    <img ref={previewImage} className={classes.image} alt={"preview"} src={currentImageSource} />

                    <div className={classes.rotateButtons}>
                        <Fab className={appendClassName("rotate-clockwise", classes.primaryButton)} onClick={()=>rotateImage(-1)}>
                            <Icon>crop_rotate</Icon>
                        </Fab>
                    </div>

                    <div className={classes.confirmButtons}>
                        <Fab className={appendClassName("cancel", classes.cancelButton)} onClick={()=>finished(false)}>
                            <Icon>close</Icon>
                        </Fab>
                        <Fab className={appendClassName("confirm", classes.confirmButton)} onClick={()=>finished(true)}>
                            <Icon>check</Icon>
                        </Fab>
                    </div>
                </div>
            </div>}
            <div className="md-overlay" />
        </div>
    )
}