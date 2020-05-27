import * as React from "react";
import {Fab} from "@material/react-fab";
import '@material/react-fab/dist/fab.css';
import {useRef} from "react";

import classes from "./TranslateTool.scss";
import MaterialIcon from "@material/react-material-icon";

import {appendClassName} from "../internal/Utils"

type TranslateToolProps = {
    visible: boolean
    className?:string
    xPos: number
    yPos: number
    onTranslationFinished: (commit: boolean, xPos: number, yPos: number) => void
    onTranslationChanged: (xPos: number, yPos: number) => void
}

type TranslateToolCachedProps = TranslateToolProps & {
    onTranslationXChanged:(xPos: number) => void
    onTranslationYChanged:(yPos: number) => void
    onTranslationFinishedInternal: (commit: boolean) => void
}

export const TranslateToolCached = React.memo<TranslateToolCachedProps>(
    (cProps) => {
        if (cProps.visible) {
            let className = appendClassName("translate-tool", classes.translateTool)
            className = appendClassName(className, cProps.className)

            return (
                <div className={className}>
                    <div>
                        <div className={classes.translateToolSlider}>
                            <div className={classes.translateToolSliderLabels}>
                                <div>-5</div>
                                <div>|&nbsp;</div>
                                <div>-2.5</div>
                                <div>|&nbsp;</div>
                                <div>0</div>
                                <div>|&nbsp;</div>
                                <div>2.5</div>
                                <div>|&nbsp;</div>
                                <div>5</div>
                            </div>
                            <div className={classes.translateToolSliderBar}>
                                <input type="range" min={-5} max={5} step={0.01} defaultValue={cProps.xPos + ""}
                                       onChange={e => cProps.onTranslationXChanged(Number(e.target.value))} list="range-values" />
                            </div>

                            <div className={classes.translateToolSliderBar}>
                                <input type="range" min={-5} max={5} step={0.01} defaultValue={cProps.yPos + ""}
                                       onChange={e => cProps.onTranslationYChanged(Number(e.target.value))} list="range-values" />
                            </div>

                            <datalist id="range-values">
                                <option value="-5" />
                                <option value="-2.5" />
                                <option value="0" />
                                <option value="2.5" />
                                <option value="5.0" />
                            </datalist>
                        </div>
                        <div className={classes.translateToolSliderFooter}>
                            <Fab className={classes.translateToolSliderButton} icon={<MaterialIcon icon='close' />} style={{backgroundColor:"#555"}} onClick={() => cProps.onTranslationFinishedInternal(false)}  />
                            <Fab className={classes.translateToolSliderButton} icon={<MaterialIcon icon='check' />} onClick={() => cProps.onTranslationFinishedInternal(true)} />
                        </div>
                    </div>
                </div>
            );
        }
        return (<aside />);
    },
    (prevProps, nextProps) => {
        return prevProps.visible === nextProps.visible;
    }
);

export function TranslateTool(props: TranslateToolProps) {
    const translationControl_xPos = useRef(0)
    const translationControl_yPos = useRef(0)

    function translationXChanged(xPos: number) {
        translationControl_xPos.current = xPos
        props.onTranslationChanged(xPos, translationControl_yPos.current)
    }

    function translationYChanged(yPos: number) {
        translationControl_yPos.current = yPos
        props.onTranslationChanged(translationControl_xPos.current, yPos)
    }

    function translationFinished(commit: boolean) {
        console.log(`translationFinished: ${commit}, ${translationControl_xPos.current}, ${translationControl_yPos.current}`)
        props.onTranslationFinished(commit, translationControl_xPos.current, translationControl_yPos.current)
    }

    return (
        <TranslateToolCached onTranslationXChanged={translationXChanged}
                             onTranslationYChanged={translationYChanged}
                             onTranslationFinishedInternal={translationFinished}
                             {...props} />
    )
}