import {Product} from "./Product";
import {ProductAsset} from "./ProductAsset";
import {SwatchItem, SwatchListing} from "./SwatchItem";
import {ProductBase} from "./ProductBase";

export class ProductColor extends ProductBase implements SwatchItem, SwatchListing {
    public product?: Product
    public assets: ProductAsset[] = []

    public get children(): SwatchItem[] {
        return this.assets
    }

    public load(json:any) {
        super.load(json)
    }
}