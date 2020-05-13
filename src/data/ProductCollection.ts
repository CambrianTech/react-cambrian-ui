import {ProductBrand} from "./ProductBrand";
import {Product} from "./Product";
import {SwatchItem} from "./SwatchItem";

export class ProductCollection implements SwatchItem {
    constructor(public brand?: ProductBrand, public json?: any) {

    }

    public collections: ProductCollection[] = []

    public products: Product[] = []

    displayCode(): string|undefined {
        return undefined;
    }

    displayName(): string {
        return "";
    }

    thumbnailPath(): string|undefined {
        return "";
    }
}