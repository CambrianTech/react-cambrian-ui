import React, {ReactNode, useCallback, useEffect, useRef} from "react"
import {useDropzone} from "react-dropzone"
import {
    CBARSceneProperties,
    CBContentManager,
    getAccelerationVector,
    getRotatedFile,
    getTags
} from "react-home-ar";

const fileAccept = "image/*";

export type ImageProperties = CBARSceneProperties & {
    roomId: string | null,
}

export type ServerProgress = {
    visible:boolean
    progress?:number
    message?:string
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

    let _isMounted = useRef(false);

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

        const messageMinDurationMS = 4000;
        const startTime = new Date();
        setProgress({visible:true, progress:0, message:"Your photo is being uploaded"});

        const [uploadFile, newWidth, newHeight] = await getRotatedFile(firstFile, props.maxImageSize ? Math.max(props.maxImageSize, 2048) : 2048);
        const exifData = await getTags(firstFile);
        const firstFilePreviewPath = URL.createObjectURL(uploadFile);

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

        CBContentManager.default.resetScene();

        const results = await CBContentManager.default.uploadRoom(uploadFile, fov, acceleration, ((progress, status) => {
            setProgress({visible:true, progress:progress, message:status})
        })).catch((error)=>handleError(error));

        const roomId = CBContentManager.default.roomId;

        if (results && roomId) {

            setProgress({visible:true, progress:1, message:"Complete"});

            if (results.dataUrl != null) {
                fetch(results.dataUrl).then(res => res.json()).then(data => {

                    if (data.hasOwnProperty("main")) {
                        //NEW SDK 2.0:
                        data.images.main = firstFilePreviewPath;
                    } else {
                        //legacy
                        if (fov) {
                            data.fov = fov;
                        }

                        if (rotation !== undefined) {
                            data.cameraRotation =  [rotation[0], -data.floorRotation, rotation[2]];
                        }

                        data['images'] = {
                            main: results.semanticUrl.replace("mask.png", "background"),
                            lighting: results.lightingUrl,
                            superpixels: results.superpixelsUrl,
                            masks: {
                                "floor": results.semanticUrl
                            },
                            roomId: roomId
                        };
                    }

                    props.onImageChosen(data);
                })
            }
            else {
                console.warn("Upload failed, no dataUrl");
                setProgress({visible:true, progress:0, message:"Upload failed", error:new Error("Upload failed")})
            }
        } else {
            console.warn("Upload failed, no room ID");
            setProgress({visible:true, progress:0, message:"Upload failed", error:new Error("Upload failed")})
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
            <div className={props.className} {...getRootProps()}>
                <input {...getInputProps()} />
                {props.children}
            </div>
        </div>
    )
}