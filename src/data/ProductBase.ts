import {CBARAssetType} from "react-home-ar";
import {SwatchItem} from "./SwatchItem";
import { uuid } from 'uuidv4';

export abstract class ProductBase implements SwatchItem {
    protected constructor(json:any) {
        if (json) {
            this.load(json)
        }
    }

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
        if (json.hasOwnProperty("thumbnailPath")) {
            this.thumbnailPath = json.thumbnailPath
        }
        if (json.hasOwnProperty("metaData")) {
            this.metaData = json.metaData
        }
    }

    public key = uuid()
    public json?: any
    public name?:string
    public code?:string
    public displayName?:string
    public assetTypes:CBARAssetType[] = []
    public thumbnailPath?:string
    public metaData:any
}