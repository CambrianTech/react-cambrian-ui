import {createRef, default as React, useCallback, useEffect, useState} from "react";
import {
    ProductItem,
    CBContentManager,
    SwatchItem
} from "react-home-ar";
import classes from "./SharePanel.scss";
import {appendClassName, isMobile} from "../internal/Utils";
import {
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton, PinterestIcon,
    PinterestShareButton, TwitterIcon,
    TwitterShareButton
} from "react-share";
import {Button} from "@material-ui/core";
import {ShareConfig} from "cambrian-base";

type SharePanelProps = ShareConfig & {
    visible:boolean
    className?:string
    product?:ProductItem
    isUploadedImage:boolean,
    needsUpload:boolean

    downloadName?:string

    getShareUrl:(socialNetwork:string)=>string
    socialClicked?:(socialNetwork:string)=>void

    resolveThumbnailPath?: (swatch: SwatchItem) => string | undefined;
    onImageUploadProgress?:(visible:boolean, status:string, percentage:number)=>void,
    onImageUploadCompleted?:(success:boolean)=>void

    onClose: () => void
}

const PINTEREST_UPLOAD_TIMEOUT = 10000;

export const SharePanelCached = React.memo<SharePanelProps>(

    (props) => {
        if (props.visible && props.product) {

            const { onClose } = props;

            const shareLinkTextBox = createRef<HTMLInputElement>();

            const touchImage = createRef<HTMLImageElement>();

            const onProgress = useCallback((visible:boolean, status:string, percentage:number) => {
                if (props.onImageUploadProgress) {
                    props.onImageUploadProgress(visible, status, percentage)
                }
            }, [props.onImageUploadProgress]);

            const onCompleted = useCallback((success:boolean) => {
                if (props.onImageUploadCompleted) {
                    props.onImageUploadCompleted(success)
                }
            }, [props.onImageUploadCompleted]);

            const socialClicked = useCallback((socialNetwork:string) => {
                if (props.socialClicked) {
                    props.socialClicked(socialNetwork)
                }
            }, [props.socialClicked]);

            const getShareUrl = useCallback((socialNetwork:string) => {
                return props.getShareUrl(socialNetwork)
            }, [props.getShareUrl]);

            const hasUpload = useCallback((name:string) => {
                const uploads = CBContentManager.default.uploadNames;
                return uploads.indexOf(name) >= 0
            }, []);

            const shareProject = useCallback(() => {

                if (shareLinkTextBox.current) {
                    shareLinkTextBox.current.select();
                    shareLinkTextBox.current.setSelectionRange(0, 99999);
                    document.execCommand("copy");
                    alert("Link copied to clipboard")
                }

                onClose()

            }, [shareLinkTextBox, onClose]);

            const touched = useCallback((show:boolean, internal?:boolean) => {
                if (!touchImage.current) return;
                if (!internal && !show) {
                    window.setTimeout(()=>{
                        touched(false, true);
                    }, 500);
                } else {
                    touchImage.current.style.display = show ? "inline" : "none";
                }
            }, [touchImage]);

            const [shareImageUrl, setShareImageUrl] = useState<string>();
            const [beforeAfterImageUrl, setBeforeAfterImageUrl] = useState<string>();
            const [performUpload, setPerformUpload] = useState(false);

            useEffect(() => {
                if (props.needsUpload) {
                    setPerformUpload(true);
                }
            }, [props.needsUpload]);

            let className = appendClassName("share-project", classes.share);
            if (props.className) {
                className = appendClassName(className, props.className);
            }

            const downloadName = props.downloadName ? props.downloadName : props.product.displayName;

            return (
                <div id={"share-project"} className={className}>
                    <div className={appendClassName("share-project-container", classes.shareContainer)}>

                        <div className={appendClassName("share-project-content", classes.shareContent)}>
                            <div className={appendClassName("share-project-preview-container", classes.previewContainer)}>
                            {shareImageUrl ?
                                <img alt={"Share preview"} crossOrigin=""
                                     className={appendClassName("share-project-preview-image", classes.previewImage)}
                                     src={shareImageUrl} /> :
                                <div className={"share-project-preview-placeholder"}/>}
                            </div>

                            <div className={appendClassName("share-project-buttons disabled", classes.mainButtons)}>
                                <div className={appendClassName("social-share-buttons", classes.socialButtons)}>
                                    <FacebookShareButton onClick={()=>socialClicked("facebook")}
                                                         url={getShareUrl("facebook")}
                                                         quote={props.subject}>
                                        <FacebookIcon size={32} round={true} path={""} crossOrigin={""} />
                                    </FacebookShareButton>

                                    <TwitterShareButton onClick={()=>socialClicked("twitter")}
                                                        title={props.subject}
                                                        url={getShareUrl("twitter")}>
                                        <TwitterIcon size={32} round={true} path={""} crossOrigin={""} />
                                    </TwitterShareButton>

                                    {/* seeing some missing attibutes, like tall pins, https://developers.pinterest.com/docs/widgets/save/?*/}

                                    <div style={{opacity:!beforeAfterImageUrl ? 0.5 : 1.0}}
                                         onClick={()=>{ if (!beforeAfterImageUrl) alert("Busy uploading, just a moment")}}>
                                        <PinterestShareButton
                                            onClick={()=>socialClicked("pinterest")}
                                            style={{cursor:!beforeAfterImageUrl ? "default" : "pointer"}}
                                            disabled={!beforeAfterImageUrl}
                                            description={props.subject}
                                            media={`${beforeAfterImageUrl}`}
                                            url={getShareUrl("pinterest")}>
                                            <PinterestIcon size={32} round={true} path={""} crossOrigin={""} />
                                        </PinterestShareButton>
                                    </div>

                                    <LinkedinShareButton onClick={()=>socialClicked("linkedin")}
                                                         title={props.subject}
                                                         url={getShareUrl("linkedin")}>
                                        <LinkedinIcon size={32} round={true} path={""} crossOrigin={""} />
                                    </LinkedinShareButton>
                                </div>

                                <input ref={shareLinkTextBox} type={'text'}
                                       onFocus={(e)=>{e.target.setSelectionRange(0, e.target.value.length);}}
                                       className={appendClassName("share-project-url-text", classes.urlText)}
                                       defaultValue={getShareUrl("text")} />

                                <div className={"primary-buttons"}>
                                    {/*https://material.io/components/buttons#usage*/}
                                    {shareImageUrl && isMobile && downloadName && (
                                        <div className={appendClassName("share-touch-image-container", classes.touchImageContainer)}
                                            onTouchStart={()=>touched(true)}>
                                            <img ref={touchImage} crossOrigin=""
                                                 onContextMenu={()=>touched(false)}
                                                 className={appendClassName("share-touch-image", classes.touchImage)}
                                                 src={shareImageUrl} alt={"Save a copy"} />
                                            <Button variant="contained" className={appendClassName("share-touch-button", classes.touchButton)}>
                                                Tap & Hold to Copy Image
                                            </Button>
                                        </div>
                                    )}
                                    {shareImageUrl && !isMobile && downloadName && (
                                        <Button variant="contained" onClick={()=>deliverRenderedImage(downloadName, shareImageUrl)}>Save Image</Button>
                                    )}

                                    <Button variant="contained" onClick={shareProject}>Copy Link</Button>

                                    <Button variant="contained" onClick={() => onClose()}>Cancel</Button>

                                    {/*<PrimaryButton touchImageUrl={props.shareImageUrl} className={"mobile-save"}>Tap & Hold to Copy Image</PrimaryButton>*/}
                                    {/*<PrimaryButton className={"web-save"} onClick={props.onSave}>Save Image</PrimaryButton>*/}
                                    {/*<PrimaryButton disabled={!props.shareUrl} className={"send"} onClick={shareProject}>Copy Link</PrimaryButton>*/}
                                    {/*<PrimaryButton white className={"cancel"} onClick={() => onClose()}>Cancel</PrimaryButton>*/}
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            );
        }
        return null;
    },
    (prevProps, nextProps) => {
        return prevProps.visible === nextProps.visible && prevProps.product === nextProps.product && prevProps.needsUpload === nextProps.needsUpload;
    }
);

export function addProductText(ctx:CanvasRenderingContext2D, product:ProductItem, imageWidth:number, imageHeight:number, bottomHeight:number) {

    const fontFamily = "Lato,Avenir Next,Roboto,Verdana,serif";

    ctx.textBaseline = 'top';
    ctx.fillStyle = "#000";

    const primaryFontSize = bottomHeight * 0.2;
    const secondaryFontSize = primaryFontSize * 0.8;

    const topMargin = (0.2 * bottomHeight);
    const leftMargin = (0.2 * bottomHeight);
    const rightMargin = (0.2 * bottomHeight);
    const lineHeight = 1.5;

    const startY = imageHeight;
    let currentX: number;
    let currentY: number;

    //Left color and style info
    let leftColorInfoWidth = 0;

    //Draw primary product info
    ctx.font = `200 ${primaryFontSize}px ${fontFamily}`;
    const primaryTextStartX = leftMargin + leftColorInfoWidth;
    currentX = primaryTextStartX;
    currentY = startY + topMargin;

    if (product.parent && product.parent.displayName) {
        ctx.fillText(product.parent.displayName, currentX, currentY);
    }

    currentY += primaryFontSize * lineHeight;

    ctx.font = `500 ${secondaryFontSize}px ${fontFamily}`;
    if (product.displayName) {
        ctx.fillText(product.displayName, currentX, currentY);
    }

    ctx.font = `100 ${secondaryFontSize}px ${fontFamily}`;

    const url = window.location.host;
    const urlTextLength = ctx.measureText(url).width;
    currentX = imageWidth - urlTextLength - rightMargin;
    currentY = ctx.canvas.height - topMargin;
    ctx.fillText(url, currentX, currentY)

}

export function addSwatchBranding(imageContext:CanvasRenderingContext2D, product:ProductItem, resolveThumbnailPath:undefined|((swatch: SwatchItem) => string | undefined)) {

    return new Promise<CanvasRenderingContext2D>((resolve, reject)=>{

        const ctx = document.createElement("canvas").getContext("2d");
        if (!ctx) {
            reject(new Error("No image context"));
            return
        }

        ctx.canvas.width = imageContext.canvas.width;
        const bottomHeight = imageContext.canvas.width * 0.2;
        ctx.canvas.height = imageContext.canvas.height  + bottomHeight;
        ctx.beginPath();
        ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "white";
        ctx.fill();

        ctx.drawImage(imageContext.canvas, 0,0);
        addProductText(ctx, product, imageContext.canvas.width, imageContext.canvas.height, bottomHeight);

        const thumbnail = resolveThumbnailPath ? resolveThumbnailPath(product) : product.thumbnail;

        if (thumbnail) {
            const img = new Image();
            img.crossOrigin = "";
            img.src = thumbnail;

            img.onload = () => {
                const size = Math.min(ctx.canvas.width / 5, ctx.canvas.height / 5);
                const xPos = ctx.canvas.width - size * 1.2;
                const yPos = imageContext.canvas.height - size * 0.8;

                ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                ctx.shadowBlur = imageContext.canvas.width * 0.05;
                ctx.drawImage(img, xPos, yPos, size, size);
                ctx.shadowBlur = 0;

                ctx.lineWidth = 1;
                ctx.strokeStyle = '#ffffff';
                ctx.strokeRect(xPos,yPos,size,size);
                resolve(ctx)
            };
            img.onerror = () => {
                //skip it.
                resolve(ctx)
            }
        } else {
            resolve(ctx)
        }
    })

}

export function drawBeforeAfter(beforeContext:CanvasImageSource, afterContext:CanvasImageSource, isHorizontal?:boolean) : CanvasRenderingContext2D | null {
    const ctx = document.createElement("canvas").getContext("2d");

    if (!ctx) return null;

    const beforeWidth = beforeContext.width as number;
    const beforeHeight = beforeContext.height as number;
    const beforeAspectRatio = beforeWidth / beforeHeight;

    const afterWidth = afterContext.width as number;
    const afterHeight = afterContext.height as number;
    const afterAspectRatio = afterWidth / afterHeight;

    const isWider = beforeAspectRatio < afterAspectRatio;

    if (isHorizontal) {
        //make image same width and twice the height of the render (afterContext)
        ctx.canvas.width = afterWidth * 2.0;
        ctx.canvas.height = afterHeight;

        const srcWidth = isWider ? beforeWidth : beforeHeight * afterAspectRatio;
        const srcHeight = isWider ? beforeWidth / afterAspectRatio : beforeHeight;
        const offsetX = isWider ? 0 : 0.5 * (beforeWidth - srcWidth);
        const offsetY = isWider ? 0.5 * (beforeHeight - srcHeight) : 0;

        //draw before image at the left
        ctx.drawImage(beforeContext, offsetX, offsetY, srcWidth, srcHeight, 0, 0, 0.5 * ctx.canvas.width, ctx.canvas.height);

        //draw after image onto the context at the bottom, starting at the middle
        ctx.drawImage(afterContext, 0.5 * ctx.canvas.width, 0);
    } else {
        //make image same width and twice the height of the render (afterContext)
        ctx.canvas.width = afterWidth;
        ctx.canvas.height = afterHeight * 2.0;

        const srcWidth = isWider ? beforeWidth : beforeHeight * afterAspectRatio;
        const srcHeight = isWider ? beforeWidth / afterAspectRatio : beforeHeight;
        const offsetX = isWider ? 0 : 0.5 * (beforeWidth - srcWidth);
        const offsetY = isWider ? 0.5 * (beforeHeight - srcHeight) : 0;

        //draw before image at the top
        ctx.drawImage(beforeContext, offsetX, offsetY, srcWidth, srcHeight, 0, 0, ctx.canvas.width, 0.5 * ctx.canvas.height);

        //draw after image onto the context at the bottom, starting at the middle
        ctx.drawImage(afterContext, 0, 0.5 * ctx.canvas.height);
    }

    return ctx;
}

function isFileReady(url: string) {
    return new Promise<boolean>((resolve, reject)=>{
        const img = new Image();
        img.crossOrigin = "";
        img.src = url;
        img.onload = () => {
            resolve(true)
        };
        img.onerror = () => {
            resolve(false)
        }
    })
}

export function whenFileAvailable(url: string, timeoutMS:number = 30) {
    return new Promise<boolean>((resolve, reject)=>{
        const startTime = performance.now();
        let interval = window.setInterval(()=> {
            isFileReady(url).then((exists)=>{
                const elapsed = performance.now() - startTime;
                if (exists) {
                    window.clearInterval(interval);
                    resolve(true);
                    //console.log(`File ${url} is now available`)
                } else if (elapsed >= timeoutMS) {
                    window.clearInterval(interval);
                    resolve(false)
                } else {
                    //console.clear();
                    //console.log("Waiting for uploaded file " + url)
                }
            }).catch((error)=>{
                console.error("Got error: ", error);
                window.clearInterval(interval);
                resolve(false)
            })
        }, 3000)
    })
}

export function deliverRenderedImage(filename:string, dataUrl:string) {

    if (isMobile) {
        //showDownloadOverlay(true, dataUrl)
    } else {
        const tag = document.createElement('a');
        tag.href = dataUrl;
        tag.download = filename;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }
};

export function SharePanel(props: SharePanelProps) {
    return <SharePanelCached {...props} />
}