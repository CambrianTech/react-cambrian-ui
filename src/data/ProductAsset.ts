import {ProductColor} from "./ProductColor";
import {SwatchItem} from "./SwatchItem";
import {ProductBase} from "./ProductBase";


export class ProductAsset extends ProductBase implements SwatchItem {
    constructor(public productColor?: ProductColor, json?: any) {
        super(json)
    }

    public load(json:any) {
        super.load(json)
    }
}