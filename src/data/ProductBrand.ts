import {ProductCollection} from "./ProductCollection";
import {SwatchItem} from "./SwatchItem";
import {ProductBase} from "./ProductBase";

export class ProductBrand extends ProductBase implements SwatchItem {
    constructor(public parentBrand?: ProductBrand, json?: any) {
        super(json)
    }

    public subBrands: ProductBrand[] = []

    public collections: ProductCollection[] = []

    get thumbnailPath(): string|undefined {
        return undefined;
    }
}