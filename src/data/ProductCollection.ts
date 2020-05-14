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

    public get children(): SwatchItem[] {
        return this.collections.length ? this.collections : this.products
    }

    public load(json:any) {
        super.load(json)

        this.collections = []
        if (json.hasOwnProperty("collections")) {
            for (const collection of json.collections) {
                this.collections.push(new ProductCollection(collection))
            }
        }

        this.products = []
        if (json.hasOwnProperty("products")) {
            for (const product of json.brands) {
                this.products.push(new Product(product))
            }
        }
    }
}