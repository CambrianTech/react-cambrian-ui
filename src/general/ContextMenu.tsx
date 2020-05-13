import React, {createRef} from "react";
import {CBARObject3D, CBARMouseEvent} from "react-home-ar";
import classes from "./ContextMenu.scss";

export type ContextMenuItemProps = {
    key:any
    title:string
}

export class ContextMenuItem extends React.Component<ContextMenuItemProps, any> {
    onClick:(item:ContextMenuItem)=>void = ()=>{}
}

type ContextMenuState = {
    items:ContextMenuItem[]
}

type ContextMenuProps = {
    onClick:(row:ContextMenuItem, obj:CBARObject3D<any>|undefined)=>void
}

export class ContextMenu extends React.Component<ContextMenuProps, ContextMenuState> {

    state = {
        items:[]
    }

    public title = "Surface"

    private visible = false
    private contextMenu = createRef<HTMLDivElement>()
    private currentObject?:CBARObject3D<any>

    public set items(items:ContextMenuItem[]) {
        this.setState({items})
    }

    public get items() {
        return this.state.items ? this.state.items : []
    }

    public showMenu(obj?:CBARObject3D<any>, event?:CBARMouseEvent) {

        if (!this.contextMenu.current) return

        if (obj && event) {
            const menuSize = this.contextMenu.current.getBoundingClientRect()
            const parentSize = this.contextMenu.current.parentElement!.getBoundingClientRect()
            const xPos = Math.max(0, Math.min(event.mouseEvent.clientX - 20, parentSize.width - menuSize.width))
            const yPos = Math.max(0, Math.min(event.mouseEvent.clientY - 20, parentSize.height - menuSize.height))

            this.contextMenu.current.style.left = `${xPos}px`
            this.contextMenu.current.style.top = `${yPos}px`
        }

        this.currentObject = obj
        this.contextMenu.current.style.visibility = "visible"
    }

    public hideMenu() {

        if (!this.contextMenu.current) return

        this.contextMenu.current.style.visibility = "hidden"
    }

    private menuItemClicked(item:ContextMenuItem, obj?:CBARObject3D<any>) {

        this.props.onClick(item, this.currentObject)
        this.hideMenu()
    }

    render() {

        return (
            <div ref={this.contextMenu} className={classes.contextMenu} onMouseLeave={()=>this.hideMenu()}
                 style={{visibility:this.visible ? "visible" : "hidden"}}>
                <div className={classes.contextMenuTitle}>
                    {this.title}
                </div>
                {this.items.map((item, index)=>{
                    return <div key={index} className={classes.contextMenuItem} onClick={()=>this.menuItemClicked(item, this.currentObject)}>{item.props.title}</div>
                })}
            </div>
        )
    }
}