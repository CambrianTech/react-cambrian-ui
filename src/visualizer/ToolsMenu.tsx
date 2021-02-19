import * as React from "react";
import {CBARToolMode} from "react-home-ar";
import {Icon} from "@material-ui/core";

export enum ToolOperation {
    Remove='remove',
    ChoosePhoto='choose-photo',
    ChooseScene='choose-scene',
    Share='share',
    ChoosePattern='choose-pattern',
}

export type ToolsMenuAction = {
    name:string
    longName?:string|undefined
    icon:React.ReactNode
    operation?:string
    requiresAsset?:boolean
    requiresSurface?:boolean
}

export const DefaultToolsMenuActions:ToolsMenuAction[] = [
    { icon: <Icon>clear</Icon>, name: 'Remove', longName:'Remove', operation:ToolOperation.Remove, requiresAsset:true },
    { icon: <Icon>add_a_photo</Icon>, name: 'Photo', operation:ToolOperation.ChoosePhoto },
    { icon: <Icon>insert_photo</Icon>, name: 'Scene', longName:'Change Scene', operation:ToolOperation.ChooseScene },
    { icon: <Icon>share</Icon>, name: 'Share', longName:'Share Project', operation:ToolOperation.Share },
    { icon: <Icon>rotate_right</Icon>, name: 'Rotate', operation:CBARToolMode.Rotate, requiresAsset:true },
    { icon: <Icon>open_with</Icon>, name: 'Move', operation:CBARToolMode.Translate, requiresAsset:true },
    { icon: <Icon>view_compact</Icon>, name: 'Pattern', operation:ToolOperation.ChoosePattern, requiresAsset:true },
    { icon: <Icon>edit</Icon>, name: 'Edit Surface', operation:CBARToolMode.DrawSurface, requiresSurface:true },
];