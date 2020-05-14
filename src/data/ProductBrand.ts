import {ProductCollection} from "./ProductCollection";
import {SwatchItem, SwatchListing} from "./SwatchItem";
import {ProductBase} from "./ProductBase";

export class ProductBrand extends ProductBase implements SwatchItem, SwatchListing {
    constructor(public parentBrand?: ProductBrand, json?: any) {
        super(json)
    }

    public subBrands: ProductBrand[] = []

    public collections: ProductCollection[] = []

    get thumbnailPath(): string|undefined {
        return undefined;
    }

    public get children(): SwatchItem[] {
        return this.subBrands.length ? this.subBrands : this.collections
    }
}