import {createRef, default as React, useCallback, useEffect, useState} from "react";
import {
    CBMethods,
    CBSceneData,
    CBSceneProperties,
    ProductItem,
    CBServerFile,
    CBContentManager,
    SwatchItem, getConfig
} from "react-home-ar";
import classes from "./SharePanel.scss";
import {appendClassName} from "../internal/Utils";
import {
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton, PinterestIcon,
    PinterestShareButton, TwitterIcon,
    TwitterShareButton
} from "react-share";

type SharePanelProps = {
    visible:boolean
    className?:string
    product?:ProductItem
    api:CBMethods,
    scene:CBSceneProperties,
    data:CBSceneData,
    isUploadedImage:boolean,
    shareSubject:string
    needsUpload:boolean

    getShareUrl:(socialNetwork:string)=>string
    socialClicked?:(socialNetwork:string)=>void

    resolveThumbnailPath?: (swatch: SwatchItem) => string | undefined;
    onProgress:(visible:boolean, status:string, percentage:number)=>void,
    onCompleted:(success:boolean)=>void

    onClose: () => void
    onSave: () => void
}

const PINTEREST_UPLOAD_TIMEOUT = 10000;

export const SharePanelCached = React.memo<SharePanelProps>(

    (props) => {
        if (props.visible && props.product) {

            const { onClose } = props;

            const shareLinkTextBox = createRef<HTMLInputElement>();

            const socialClicked = useCallback((socialNetwork:string) => {
                if (props.socialClicked) {
                    props.socialClicked(socialNetwork)
                }
            }, [props.socialClicked]);

            const getShareUrl = useCallback((socialNetwork:string) => {
                return props.getShareUrl(socialNetwork)
            }, [props.getShareUrl]);

            const hasUpload = useCallback((name:CBServerFile) => {
                const uploads = getConfig().uploadNames;
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

            const [shareImageUrl, setShareImageUrl] = useState<string>();
            const [beforeAfterImageUrl, setBeforeAfterImageUrl] = useState<string>();
            const [performUpload, setPerformUpload] = useState(false);

            const doShareUpload = useCallback((product:ProductItem) => {
                (async () => {

                    setPerformUpload(false);

                    props.onProgress(true, "Contacting server", 0.3);
                    const shareImage = await getShareImage(props.api);

                    if (shareImage) {

                        console.log("upload mask");

                        const maskUrl = await CBContentManager.default.uploadFile(props.data.maskCanvas, CBServerFile.Mask);
                        if (!maskUrl) {
                            console.error("Could not upload mask image!");
                            props.onCompleted(false);
                            return
                        }
                        props.onProgress(true, "Uploading Pinterest image", 0.2);

                        console.log("finish share image");
                        props.onProgress(true, "Uploading Pinterest image", 0.3);

                        addSwatchBranding(shareImage, product, props.resolveThumbnailPath).then(ctx=>{
                            const image = ctx.canvas.toDataURL("image/png");
                            setShareImageUrl(image)
                        });

                        console.log("upload share as preview");
                        props.onProgress(true, "Uploading Pinterest image", 0.5);

                        const previewUrl = await CBContentManager.default.uploadFile(shareImage.canvas, CBServerFile.Preview);
                        if (!previewUrl) {
                            console.error("Could not upload preview image!");
                            props.onCompleted(false);
                            return
                        }

                        if (hasUpload(CBServerFile.Pinterest)) {
                            console.log("generate before/after");
                            const pinterest = props.isUploadedImage ? await generateBeforeAfter(props.api, props.scene) : await getShareImage(props.api);

                            if (!pinterest) {
                                return
                            }

                            props.onProgress(true, "Uploading Pinterest image", 0.6);

                            console.log("add branding");
                            const pinterestImage = await addSwatchBranding(pinterest, product, props.resolveThumbnailPath);
                            console.log("branding added");
                            const pinterestUrl = await CBContentManager.default.uploadFile(pinterestImage.canvas, CBServerFile.Pinterest);
                            if (!pinterestUrl) {
                                console.error("Could not upload pinterest image!");
                                props.onCompleted(false);
                                return
                            }

                            console.log("wait on pinterest");
                            //takes a few seconds to get to aws
                            whenFileAvailable(pinterestUrl, PINTEREST_UPLOAD_TIMEOUT).then(()=>{
                                setBeforeAfterImageUrl(pinterestUrl)
                            });

                            props.onProgress(true, "Uploading Pinterest image", 0.7);
                        }

                        props.onProgress(true, "Upload Successful", 1.0);

                        //setShareUrl(updateUrl());
                    } else {
                        console.error("Could not generate share image!");
                        props.onCompleted(false);
                    }
                })()
            }, [hasUpload]);

            useEffect(() => {
                if (props.needsUpload) {
                    setPerformUpload(true);
                    console.log("performUpload");
                }
            }, [props.needsUpload]);

            useEffect(() => {
                if (performUpload && props.scene && props.product && props.visible) {
                    doShareUpload(props.product)
                }
            }, [performUpload, props.scene, props.product, props.visible]);

            let className = appendClassName("share-project", classes.share);
            if (props.className) {
                className = appendClassName(className, props.className);
            }

            return (
                <div id={"share-project"} className={className}>
                    <div className={"share-project-container"}>

                        <div className="share-project-content">
                            {shareImageUrl ?
                                <img alt={"Share preview"}
                                     className={appendClassName("share-project-preview-image", classes.previewImage)}
                                     src={shareImageUrl} /> :
                                <div className={"share-project-preview-placeholder"}/>}

                            <div className={appendClassName("share-project-buttons disabled", classes.mainButtons)}>
                                <div className={appendClassName("social-share-buttons", classes.socialButtons)}>
                                    <FacebookShareButton onClick={()=>socialClicked("facebook")}
                                                         url={getShareUrl("facebook")}
                                                         quote={props.shareSubject}>
                                        <FacebookIcon size={32} round={true} path={""} crossOrigin={""} />
                                    </FacebookShareButton>

                                    <TwitterShareButton onClick={()=>socialClicked("twitter")}
                                                        title={props.shareSubject}
                                                        url={getShareUrl("twitter")}>
                                        <TwitterIcon size={32} round={true} path={""} crossOrigin={""} />
                                    </TwitterShareButton>

                                    {/* seeing some missing attibutes, like tall pins, https://developers.pinterest.com/docs/widgets/save/?*/}

                                    {hasUpload(CBServerFile.Pinterest) &&
                                    <div style={{opacity:!beforeAfterImageUrl ? 0.5 : 1.0}}
                                         onClick={()=>{ if (!beforeAfterImageUrl) alert("Busy uploading, just a moment")}}>
                                        <PinterestShareButton
                                            onClick={()=>socialClicked("pinterest")}
                                            style={{cursor:!beforeAfterImageUrl ? "default" : "pointer"}}
                                            disabled={!beforeAfterImageUrl}
                                            description={props.shareSubject}
                                            media={`${beforeAfterImageUrl}`}
                                            url={getShareUrl("pinterest")}>
                                            <PinterestIcon size={32} round={true} path={""} crossOrigin={""} />
                                        </PinterestShareButton>
                                    </div>}

                                    <LinkedinShareButton onClick={()=>socialClicked("linkedin")}
                                                         title={props.shareSubject}
                                                         url={getShareUrl("linkedin")}>
                                        <LinkedinIcon size={32} round={true} path={""} crossOrigin={""} />
                                    </LinkedinShareButton>
                                </div>

                                <input ref={shareLinkTextBox} type={'text'}
                                       className={appendClassName("share-project-url-text", classes.urlText)}
                                       defaultValue={getShareUrl("text")} />

                                {/*<div className={"primary-buttons"}>*/}
                                {/*    <PrimaryButton touchImageUrl={props.shareImageUrl} className={"mobile-save"}>Tap & Hold to Copy Image</PrimaryButton>*/}
                                {/*    <PrimaryButton className={"web-save"} onClick={props.onSave}>Save Image</PrimaryButton>*/}
                                {/*    <PrimaryButton disabled={!props.shareUrl} className={"send"} onClick={shareProject}>Copy Link</PrimaryButton>*/}
                                {/*    <PrimaryButton white className={"cancel"} onClick={() => onClose()}>Cancel</PrimaryButton>*/}
                                {/*</div>*/}

                            </div>

                        </div>
                    </div>
                </div>
            );
        }
        return null;
    },
    (prevProps, nextProps) => {
        return prevProps.visible === nextProps.visible && prevProps.product === nextProps.product;
    }
);

export async function getShareImage(api:CBMethods) {
    const screenshot = await api.captureScreenshot();

    if (screenshot) {
        const img = new Image();
        img.src = screenshot;
        await new Promise(resolve => img.onload = resolve);

        const context = document.createElement("canvas").getContext('2d');
        if (context) {
            context.canvas.width = img.width;
            context.canvas.height = img.height;
            context.drawImage(img, 0, 0);

            return context
        }
    }
    return null
}

function addProductText(ctx:CanvasRenderingContext2D, product:ProductItem, imageWidth:number, imageHeight:number, bottomHeight:number) {

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

function addSwatchBranding(imageContext:CanvasRenderingContext2D, product:ProductItem, resolveThumbnailPath:undefined|((swatch: SwatchItem) => string | undefined)) {

    return new Promise<CanvasRenderingContext2D>((resolve, reject)=>{

        const ctx = document.createElement("canvas").getContext("2d");
        if (!ctx) {
            reject();
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

        const thumbnail = resolveThumbnailPath ? resolveThumbnailPath(product) : product.thumbnail

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
                reject()
            }
        } else {
            resolve(ctx)
        }
    })

}
function generateBeforeAfter(api:CBMethods, sceneData:CBSceneProperties) {

    return new Promise<CanvasRenderingContext2D>((resolve, reject)=>{

        getShareImage(api).then((imageContext)=>{

            if (imageContext) {
                const ctx = document.createElement("canvas").getContext("2d")!;

                ctx.canvas.width = imageContext.canvas.width;
                ctx.canvas.height = imageContext.canvas.height * 2.0;

                //draw render onto the image
                ctx.drawImage(imageContext.canvas, 0, imageContext.canvas.height);
                const img = new Image();
                img.crossOrigin = "";
                img.src = sceneData.backgroundUrl;

                img.onload = () => {
                    if (ctx) {
                        const srcAspectRatio = img.width / img.height;
                        const renderAspectRatio = imageContext.canvas.width / imageContext.canvas.height;

                        if (srcAspectRatio < renderAspectRatio) {
                            const srcWidth = img.width;
                            const srcHeight = img.width / renderAspectRatio;
                            const offsetY = (img.height - srcHeight) / 2.0;
                            ctx.drawImage(img, 0, offsetY, srcWidth, srcHeight,
                                0, 0, imageContext.canvas.width, imageContext.canvas.height)
                        } else {
                            const srcWidth = img.height * renderAspectRatio;
                            const srcHeight = img.height;
                            const offsetX = (img.width - srcWidth) / 2.0;
                            ctx.drawImage(img, offsetX, 0, srcWidth, srcHeight,
                                0, 0, imageContext.canvas.width, imageContext.canvas.height)
                        }

                        resolve(ctx)
                    } else {
                        reject()
                    }
                };
                img.onerror = () => {
                    reject()
                }
            } else {
                reject()
            }
        })
    })
}

function isFileReady(url: string) {
    return new Promise<boolean>((resolve, reject)=>{
        const http = new XMLHttpRequest();
        http.open('GET', url);
        http.onreadystatechange = () => {
            if (http.readyState === http.DONE) {
                if (http.status === 200) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }
        };
        http.onerror = () => {
            resolve(false)
        };
        http.send()
    })
}
function whenFileAvailable(url: string, timeoutMS:number = 30) {
    return new Promise<boolean>((resolve, reject)=>{
        const startTime = performance.now();
        let interval = window.setInterval(()=> {
            isFileReady(url).then((exists)=>{
                const elapsed = performance.now() - startTime;
                if (exists) {
                    window.clearInterval(interval);
                    resolve(true);
                    console.log(`File ${url} is now available`)
                } else if (elapsed >= timeoutMS) {
                    window.clearInterval(interval);
                    resolve(false)
                } else {
                    console.clear();
                    console.log("Waiting for uploaded file " + url)
                }
            }).catch((error)=>{
                console.error("Got error: ", error);
                window.clearInterval(interval);
                resolve(false)
            })
        }, 3000)
    })
}
export function SharePanel(props: SharePanelProps) {
    return <SharePanelCached {...props} />
}