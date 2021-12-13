import React, {createRef, useCallback, useContext, useEffect, useMemo} from "react"

import './ShareProject.scss'

import {
    TwitterShareButton,
    FacebookShareButton,
    FacebookIcon,
    TwitterIcon,
    PinterestIcon,
    PinterestShareButton, LinkedinShareButton, LinkedinIcon
} from "react-share"
import {ProductColor} from "react-home-ar";
import {Button} from "@material-ui/core";

type ShareProjectProps = {
    open: boolean
    selectedColor?:ProductColor
    shareUrl?:string
    shareSubject?:string
    pinterestImageUrl?:string,
    subdomain?:string,

    shareImageUrl?:string
    onClose: () => void
    onSave: () => void
}

// &utm_campaign=%5BD%5D%20-%20US%20-%20Brand%20-%20All%20-%20Floorvana%20Plus%20-%20Shared%20Pins
export const _shareSubject = 'Take inspiration to the next level. See YOUR room come to life';

export default function ShareProject(props: ShareProjectProps) {
    const { onClose, selectedColor } = props;
    const shareLinkTextBox = createRef<HTMLInputElement>();

    const shareSubject = useMemo(()=>{
        return props.shareSubject ? props.shareSubject : _shareSubject;
    }, [])

    useEffect(() => {
        const content = document.querySelector(".share-project-content") as HTMLElement;

        if (content) {
            if (props.shareUrl) {
                content.classList.remove("disabled");

                if (shareLinkTextBox.current) {
                    shareLinkTextBox.current.select();
                    shareLinkTextBox.current.setSelectionRange(0, 99999);
                    document.execCommand("copy")
                    shareLinkTextBox.current.blur()
                }


            } else {
                content.classList.add("disabled")
            }
        }

        const scroller = document.querySelector(".share-project") as HTMLElement;
        if (scroller) {
            scroller.scrollTo(0, 1000)
        }

    }, [props.shareUrl, shareLinkTextBox]);

    const shareProject = useCallback(() => {

        if (!props.shareUrl) {
            console.log("No share URL");
            return
        }

        if (shareLinkTextBox.current) {
            shareLinkTextBox.current.select();
            shareLinkTextBox.current.setSelectionRange(0, 99999);
            document.execCommand("copy");
        }

        onClose()

    }, [props.shareUrl, shareLinkTextBox, onClose, selectedColor]);

    const subdomain = props.subdomain;

    const shareUrl = useMemo(()=>{
        if (props.shareUrl && props.shareUrl.startsWith("http://localhost:3000") && subdomain){
            return props.shareUrl.replace("http://localhost:3000", `https://${subdomain}.cambrianar.com`);
        }
        return props.shareUrl;
    }, [props.shareUrl, subdomain])

    const socialClicked = useCallback((socialNetwork:string) => {
        console.log(socialNetwork)
    }, []);

    const getShareUrl = useCallback((share:string) => {
        if (!shareUrl) return "";
        const url = new URL(shareUrl);
        url.searchParams.set('share', share);
        url.search = url.searchParams.toString();
        return url.toString();
    }, [shareUrl]);

    return (
        <div id={"share-project"} className={"share-project"}>
            <div className={"share-project-container"}>
                <button className={"share-project-close"} onClick={() => onClose()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19">
                        <g fill="none" fillRule="evenodd" stroke="#1a1919" strokeWidth="1.5">
                            <path d="M18.627.873L1.373 18.127M1.515 1.015l16.97 16.97" />
                        </g>
                    </svg>
                </button>

                <div className="share-project-content">
                    {props.shareImageUrl ?
                        <img alt={"Share preview"}
                             className={"share-project-preview-image"}
                             src={props.shareImageUrl} /> :
                        <div className={"share-project-preview-placeholder"}/>}

                    <div className="share-project-buttons disabled">
                        <div className="social-share-buttons">
                            <FacebookShareButton onClick={()=>socialClicked("facebook")}
                                                 url={getShareUrl(`Shared Facebook Post`)}
                                                 quote={shareSubject}>
                                <FacebookIcon size={32} round={true} path={""} crossOrigin={""} />
                            </FacebookShareButton>

                            <TwitterShareButton onClick={()=>socialClicked("twitter")}
                                                title={shareSubject}
                                                url={getShareUrl(`Shared Twitter Tweet`)}>
                                <TwitterIcon size={32} round={true} path={""} crossOrigin={""} />
                            </TwitterShareButton>

                            {/* seeing some missing attibutes, like tall pins, https://developers.pinterest.com/docs/widgets/save/?*/}
                            <div style={{opacity:!props.pinterestImageUrl ? 0.5 : 1.0}}
                                 onClick={()=>{ if (!props.pinterestImageUrl) alert("Busy uploading, just a moment")}}>
                                <PinterestShareButton
                                    onClick={()=>socialClicked("pinterest")}
                                    style={{cursor:!props.pinterestImageUrl ? "default" : "pointer"}}
                                    disabled={!props.pinterestImageUrl}
                                    description={shareSubject}
                                    media={`${props.pinterestImageUrl}`}
                                    url={getShareUrl(`Shared Pins`)}>
                                    <PinterestIcon size={32} round={true} path={""} crossOrigin={""} />
                                </PinterestShareButton>
                            </div>

                            <LinkedinShareButton onClick={()=>socialClicked("linkedin")}
                                                 title={shareSubject}
                                                 url={getShareUrl('Shared LinkedIn Post')}>
                                <LinkedinIcon size={32} round={true} path={""} crossOrigin={""} />
                            </LinkedinShareButton>
                        </div>

                        <input className={"share-project-url-text"} ref={shareLinkTextBox} type={'text'}
                               defaultValue={props.shareUrl} />

                        <div className={"primary-buttons"}>
                            {/*<Button className={"mobile-save"} title={"Tap & Hold to Copy Image"} onClick={} />*/}
                            <Button className={"web-save"} onClick={props.onSave} title={"Save Image"}/>
                            <Button disabled={!props.shareUrl} className={"send"} onClick={shareProject} title={"Copy Link"} />
                            <Button className={"cancel"} onClick={() => onClose()} title={"Cancel"} />
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )}
