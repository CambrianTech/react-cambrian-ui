import {ProductCollection} from "./ProductCollection";
import {SwatchItem, SwatchListing} from "./SwatchItem";
import {ProductBase} from "./ProductBase";

export class ProductBrand extends ProductBase implements SwatchItem, SwatchListing {
    constructor(public parentBrand?: ProductBrand, json?: any) {
        super(json)
    }

    public brands: ProductBrand[] = []
    public collections: ProductCollection[] = []

    public get children(): SwatchItem[] {
        return this.brands.length ? this.brands : this.collections
    }

    public load(json:any) {
        super.load(json)

        this.brands = []
        if (json.hasOwnProperty("brands")) {
            for (const brand of json.brands) {
                this.brands.push(new ProductBrand(brand))
            }
        }

        this.collections = []
        if (json.hasOwnProperty("collections")) {
            for (const collection of json.collections) {
                this.collections.push(new ProductCollection(collection))
            }
        }
    }
}