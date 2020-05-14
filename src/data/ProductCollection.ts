import {ProductBrand} from "./ProductBrand";
import {Product} from "./Product";
import {SwatchItem} from "./SwatchItem";
import {ProductBase} from "./ProductBase";

export class ProductCollection extends ProductBase implements SwatchItem {
    constructor(public brand?: ProductBrand, json?: any) {
        super(json)
    }

    public collections: ProductCollection[] = []

    public products: Product[] = []

    get thumbnailPath(): string|undefined {
        return undefined;
    }
}