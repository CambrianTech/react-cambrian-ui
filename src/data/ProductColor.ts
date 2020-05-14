import {Product} from "./Product";
import {ProductAsset} from "./ProductAsset";
import {SwatchItem} from "./SwatchItem";
import {ProductBase} from "./ProductBase";

export class ProductColor extends ProductBase implements SwatchItem {
    constructor(public product?: Product, json?: any) {
        super(json)
    }

    public assets: ProductAsset[] = []

    get thumbnailPath(): string|undefined {
        return undefined;
    }
}