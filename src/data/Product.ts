import {ProductColor} from "./ProductColor";
import {SwatchItem} from "./SwatchItem";
import {ProductBase} from "./ProductBase";

export class Product extends ProductBase implements SwatchItem {
    constructor(public product?: Product, json?: any) {
        super(json)
    }

    public colors: ProductColor[] = []

    get thumbnailPath(): string | undefined {
        return undefined;
    }
}