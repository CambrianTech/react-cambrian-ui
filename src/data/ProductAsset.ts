import {ProductColor} from "./ProductColor";
import {SwatchItem} from "./SwatchItem";
import {ProductBase} from "./ProductBase";


export class ProductAsset extends ProductBase implements SwatchItem {
    public productColor?: ProductColor

    public load(json:any) {
        super.load(json)
    }
}