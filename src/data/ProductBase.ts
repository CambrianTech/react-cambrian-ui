import {CBARAssetType} from "react-home-ar";
import {SwatchItem} from "./SwatchItem";
import { uuid } from 'uuidv4';
import {ProductBrand} from "./ProductBrand";

export abstract class ProductBase implements SwatchItem {

    public load(json:any) {
        this.json = json
        if (json.hasOwnProperty("name")) {
            this.name = json.name
        }
        if (json.hasOwnProperty("code")) {
            this.code = json.code
        }
        if (json.hasOwnProperty("displayName")) {
            this.displayName = json.displayName
        }
        if (json.hasOwnProperty("assetTypes")) {
            this.assetTypes = json.assetTypes
        }
        if (json.hasOwnProperty("thumbnail")) {
            this.thumbnail = json.thumbnail
        }
        if (json.hasOwnProperty("color")) {
            this.color = json.color
        }
        if (json.hasOwnProperty("metaData")) {
            this.metaData = json.metaData
        }
    }

    public abstract get description():string

    public abstract get parent():SwatchItem|undefined

    public abstract get brand():ProductBrand

    public get hasColumns(): boolean {
        return false
    }

    public get children(): ProductBase[] {
        return []
    }

    public key = uuid()
    public json?: any
    public name?:string
    public code?:string
    public displayName?:string
    public assetTypes:CBARAssetType[] = []
    public thumbnail?:string
    public color?:string
    public metaData:any
}