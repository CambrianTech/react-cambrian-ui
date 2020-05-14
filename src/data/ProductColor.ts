import {Product} from "./Product";
import {SwatchItem, SwatchListing} from "./SwatchItem";
import {ProductBase} from "./ProductBase";

export class ProductColor extends ProductBase implements SwatchItem, SwatchListing {
    public product?: Product
    public ppi?:number
    public scale?:number

    public get children(): SwatchItem[] {
        return []
    }

    public load(json:any) {
        super.load(json)
        if (json.hasOwnProperty("ppi")) {
            this.ppi = json.ppi
        }
        if (json.hasOwnProperty("scale")) {
            this.scale = json.scale
        }
    }
}