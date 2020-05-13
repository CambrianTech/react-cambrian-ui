import React, {ReactNode, useRef, useEffect, useCallback} from "react"
import { useDropzone } from "react-dropzone"
import {CBSceneParams, getRotatedFile, CBContentManager} from "react-home-ar";

const fileAccept = "image/*";

export type ImageProperties = CBSceneParams & {
    roomId: string | null,
}

export type UploadProgress = {
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
    onProgress?:(status: UploadProgress) => void
}

export function openImageDialog() {
    const inputs = Array.from(document.getElementsByTagName("input"));
    const input = inputs.find(element => element.type === "file") as HTMLInputElement;

    if (input) {
        input.click()
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

    const setProgress = useCallback((progress:UploadProgress) => {
        if (props.onProgress) {
            props.onProgress(progress)
        }
    }, [props])

    async function upload(acceptedFiles: File[]) {
        const firstFile = acceptedFiles[0];

        if (!firstFile)
            return;

        const messageMinDurationMS = 4000
        const startTime = new Date();
        setProgress({visible:true, progress:0, message:"Your photo is being uploaded"})

        const uploadFile = await getRotatedFile(firstFile, props.maxImageSize ? Math.max(props.maxImageSize, 2048) : 2048)
        const firstFilePreviewPath = URL.createObjectURL(uploadFile)

        CBContentManager.default.resetScene()

        const results = await CBContentManager.default.uploadRoom(uploadFile, ((progress, status) => {
            setProgress({visible:true, progress:progress, message:status})
        })).catch((error)=>handleError(error))

        const roomId = CBContentManager.default.roomId

        if (results && roomId) {

            setProgress({visible:true, progress:1, message:"Complete"})

            if (results.dataUrl != null) {
                fetch(results.dataUrl).then(res => res.json()).then(data => {
                    //TODO: something maybe on the server for main,preview,thumbnail?
                    data.images.main = firstFilePreviewPath
                    props.onImageChosen(data)
                })
            } else {
                setProgress({visible:true, progress:0, message:"Upload failed", error:new Error("Upload failed")})
            }
        } else {
            setProgress({visible:true, progress:0, message:"Upload failed", error:new Error("Upload failed")})
        }

        const elapsed = new Date().getTime() - startTime.getTime()
        window.setTimeout(() => {
            if (_isMounted.current) {
                setProgress({visible:false})
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