import {ProductBrand} from "./ProductBrand";
import {Product} from "./Product";
import {SwatchItem, SwatchListing} from "./SwatchItem";
import {ProductBase} from "./ProductBase";

export class ProductCollection extends ProductBase implements SwatchItem, SwatchListing {
    constructor(public brand?: ProductBrand, json?: any) {
        super(json)
    }

    public collections: ProductCollection[] = []

    public products: Product[] = []

    get thumbnailPath(): string|undefined {
        return undefined;
    }

    public get children(): SwatchItem[] {
        return this.collections.length ? this.collections : this.products
    }
}