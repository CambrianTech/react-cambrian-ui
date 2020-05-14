import {CBARAssetType} from "react-home-ar";
import {SwatchItem} from "./SwatchItem";

export abstract class ProductBase implements SwatchItem {
    protected constructor(public json?: any) {

    }

    public key = ""
    public name?:string
    public code?:string
    public displayName?:string
    public assetTypes:CBARAssetType[] = []
    public metaData:any
}