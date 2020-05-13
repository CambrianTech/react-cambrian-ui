import {ProductColor} from "./ProductColor";
import {SwatchItem} from "./SwatchItem";

export class Product implements SwatchItem {
    constructor(public product?: Product, public json?: any) {

    }

    public colors: ProductColor[] = []

    displayCode(): string | undefined {
        return undefined;
    }

    displayName(): string {
        return "";
    }

    thumbnailPath(): string | undefined {
        return undefined;
    }
}