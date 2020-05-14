import {Product} from "./Product";
import {SwatchItem, SwatchListing} from "./SwatchItem";
import {ProductBase} from "./ProductBase";
import {ProductBrand} from "./ProductBrand";

export class ProductCollection extends ProductBase implements SwatchItem, SwatchListing {

    public brand?: ProductBrand
    public parentCollection?: ProductCollection

    public collections: ProductCollection[] = []
    public products: Product[] = []

    public get children(): SwatchItem[] {
        return this.collections.length ? this.collections : this.products
    }

    public load(json:any) {
        super.load(json)

        this.collections = []
        if (json.hasOwnProperty("collections")) {
            for (const collectionJson of json.collections) {
                const collection = new ProductCollection()
                collection.load(collectionJson)
                collection.parentCollection = this
                this.collections.push(collection)
            }
        }

        this.products = []
        if (json.hasOwnProperty("products")) {
            for (const productJson of json.products) {
                const product = new Product()
                product.load(productJson)
                product.collection = this
                this.products.push(product)
            }
        }
    }
}