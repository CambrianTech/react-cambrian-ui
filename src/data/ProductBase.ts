import {CBARAssetType} from "react-home-ar";
import {SwatchItem} from "./SwatchItem";
import { uuid } from 'uuidv4';

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
    public thumbnail?:string
    public metaData:any
}