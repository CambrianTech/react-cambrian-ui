import {ProductCollection} from "./ProductCollection";
import {SwatchItem} from "./SwatchItem";

export class ProductBrand implements SwatchItem {
    constructor(public parentBrand?: ProductBrand, public json?: any) {

    }

    public subBrands: ProductBrand[] = []

    public collections: ProductCollection[] = []

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