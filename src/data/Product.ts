import {ProductColor} from "./ProductColor";
import {SwatchItem, SwatchListing} from "./SwatchItem";
import {ProductBase} from "./ProductBase";

export class Product extends ProductBase implements SwatchItem, SwatchListing {
    constructor(public product?: Product, json?: any) {
        super(json)
    }

    public colors: ProductColor[] = []

    get thumbnailPath(): string | undefined {
        return undefined;
    }

    public get children(): SwatchItem[] {
        return this.colors
    }
}