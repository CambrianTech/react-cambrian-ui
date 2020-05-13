import {Product} from "./Product";
import {ProductAsset} from "./ProductAsset";
import {SwatchItem} from "./SwatchItem";

export class ProductColor implements SwatchItem {
    constructor(public product?: Product, public json?: any) {

    }

    public assets: ProductAsset[] = []

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