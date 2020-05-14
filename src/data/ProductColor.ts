import {Product} from "./Product";
import {ProductAsset} from "./ProductAsset";
import {SwatchItem, SwatchListing} from "./SwatchItem";
import {ProductBase} from "./ProductBase";

export class ProductColor extends ProductBase implements SwatchItem, SwatchListing {
    constructor(public product?: Product, json?: any) {
        super(json)
    }

    public assets: ProductAsset[] = []

    public get children(): SwatchItem[] {
        return this.assets
    }

    public load(json:any) {
        super.load(json)
    }
}