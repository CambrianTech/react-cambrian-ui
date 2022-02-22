import React, {ReactNode, useCallback, useEffect, useRef, useState} from "react"
import {useDropzone} from "react-dropzone"
import {
    CBARSceneProperties,
    CBContentManager,
    getAccelerationVector,
    getRotatedFile,
    getTags,
    UploadStatus
} from "react-home-ar";
import {ImageRotation} from "./ImageRotation";

const fileAccept = "image/*";

export type ImageProperties = CBARSceneProperties & {
    roomId: string | null,
}

export type ServerProgress = {
    visible:boolean
    progress?:number
    message?:UploadStatus
    error?:any
}

interface ImageUploadProperties {
    ref?: any
    className?: string
    children?: ReactNode

    maxImageSize?:number
    onImageChosen: (props: ImageProperties) => void
    onProgress?:(status: ServerProgress) => void
}

export function openImageDialog() {
    const inputs = Array.from(document.getElementsByTagName("input"));
    const input = inputs.find(element => element.type === "file") as HTMLInputElement;

    if (input) {
        input.click()
    } else {
        console.error("No ImageUpload component found!")
    }
}

export function ImageUpload(props: ImageUploadProperties) {

    const _isMounted = useRef(false);
    const [rawImage, setRawImage] = useState<string>();
    const [fov, setFov] = useState<number>();
    const [acceleration, setAcceleration] = useState<[number,number,number]>();
    const [rotation, setRotation] = useState<[number,number,number]>();

    useEffect(() => {
        _isMounted.current = true;

        return () => {
            _isMounted.current = false
        }
    }, []);

    const setProgress = useCallback((progress:ServerProgress) => {
        if (props.onProgress) {
            props.onProgress(progress)
        }
    }, [props]);

    const onImageChosen = useCallback((result:string, useChanges:boolean) => {
        setRawImage(undefined);
        if (useChanges) {
            uploadImage(result, fov, acceleration, rotation).then();
        }
    }, [fov, acceleration, rotation, uploadImage]);

    const messageMinDurationMS = 4000;

    async function upload(acceptedFiles: File[]) {

        const inputs = Array.from(document.getElementsByTagName("input"));
        const input = inputs.find(element => element.type === "file") as HTMLInputElement;
        if (input) {
            (input as any).value = null
        }

        if (!acceptedFiles.length || !acceptedFiles[0]) {
            return;
        }

        const firstFile = acceptedFiles[0];
        const [uploadFile, newWidth, newHeight] = await getRotatedFile(firstFile, props.maxImageSize ? Math.max(props.maxImageSize, 2048) : 2048);
        const exifData = await getTags(firstFile);

        //Add small factor to deal with crop factor, could be calculated exactly
        const focalLength = exifData.get("FocalLengthIn35mmFilm")+.25;

        //which fov are we calculating
        const portait_landscape = newWidth>newHeight ? 36 : 24;
        const fov = 2*Math.atan2(portait_landscape,(2*focalLength)) * 180 / Math.PI;

        let rotation:[number, number, number] | undefined;
        let acceleration: [number, number, number] | undefined;

        if (exifData.get("Make") === "Apple" && exifData.get("MakerNote")) {
            const accelerationVector = await getAccelerationVector(exifData.get("MakerNote")) as number[]|undefined;

            if (accelerationVector && accelerationVector.length && accelerationVector.length === 6) {
                const x = accelerationVector[4]/accelerationVector[5];
                const y = accelerationVector[0]/accelerationVector[1];
                const z = accelerationVector[2]/accelerationVector[3];

                //for new SDK:
                acceleration = newWidth > newHeight ? [x, y, -z] : [x, z, -y];

                //for legacy API:
                rotation = [Math.asin(acceleration[0]), Math.asin(acceleration[1]), Math.asin(acceleration[2])];
            }
        }

        const image = await CBContentManager.blobToDataUri(uploadFile);

        setRawImage(image);
        setFov(fov);
        setAcceleration(acceleration);
        setRotation(rotation);

        //await uploadImage(image, fov, acceleration, rotation)
    }

    async function uploadImage(image:string, fov:number|undefined, acceleration:[number,number,number]|undefined, rotation:[number,number,number]|undefined) {

        setProgress({visible:true, progress:0, message:UploadStatus.Uploading});

        if (!CBContentManager.default) {
            return
        }

        const startTime = new Date();
        CBContentManager.default.resetScene();

        const uploadFile = CBContentManager.default.dataURItoBlob(image);

        const dataUrl = await CBContentManager.default.uploadRoom(uploadFile, fov, acceleration, ((progress, status) => {
            setProgress({visible:true, progress:progress, message:status})
        })).catch((error)=>handleError(error));

        const roomId = CBContentManager.default.roomId;

        if (dataUrl && roomId) {

            setProgress({visible:true, progress:1, message:UploadStatus.Completed});

            fetch(dataUrl).then(res => res.json()).then(data => {

                // if (data.hasOwnProperty("main")) {
                //     //NEW SDK 2.0:
                //     data.images.main = URL.createObjectURL(uploadFile);
                // }

                props.onImageChosen(data);
            })

        } else {
            console.warn("Upload failed, no room ID");
            setProgress({visible:true, progress:0, message:UploadStatus.Failed, error:new Error(UploadStatus.Failed)})
        }

        const elapsed = new Date().getTime() - startTime.getTime();
        window.setTimeout(() => {
            if (_isMounted.current) {
                setProgress({visible:false});
            }
        }, Math.max(messageMinDurationMS - elapsed, 100))
    }

    function handleError(e: any) {
        if (_isMounted.current) {
            setProgress({visible:true, error:e})
        }
    }

    const { getRootProps, getInputProps } = useDropzone({
        accept: fileAccept,
        onDrop: upload
    });

    return (
        <div ref={props.ref}>
            <ImageRotation imageUrl={rawImage} onFinished={onImageChosen} />
            <div className={props.className} {...getRootProps()}>
                <input {...getInputProps()} />
                {props.children}
            </div>
        </div>
    )
}