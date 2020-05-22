import {Product} from "./Product";
import {SwatchItem} from "./SwatchItem";
import {ProductBase} from "./ProductBase";
import {ProductBrand} from "./ProductBrand";

export class ProductCollection extends ProductBase implements SwatchItem {

    public _brand?: ProductBrand
    public collection?: ProductCollection

    public collections: ProductCollection[] = []
    public products: Product[] = []

    public get brand(): ProductBrand {
        return this.collection ? this.collection.brand : this._brand!
    }

    public set brand(value) {
        if (!this.collection) {
            this._brand = value
        }
    }

    public get parent():SwatchItem|undefined {
        return this.collection ? this.collection : this._brand
    }

    public get children(): ProductBase[] {
        return this.collections.length ? this.collections : this.products
    }

    public load(json:any) {
        super.load(json)

        this.collections = []
        if (json.hasOwnProperty("collections")) {
            for (const collectionJson of json.collections) {
                const collection = new ProductCollection()
                collection.load(collectionJson)
                collection.collection = this
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