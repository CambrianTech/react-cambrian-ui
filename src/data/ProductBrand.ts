import {ProductCollection} from "./ProductCollection";
import {SwatchItem} from "./SwatchItem";
import {ProductBase} from "./ProductBase";

export class ProductBrand extends ProductBase implements SwatchItem {
    public parentBrand?: ProductBrand
    public subBrands: ProductBrand[] = []
    public collections: ProductCollection[] = []

    public get brand(): ProductBrand {
        return this
    }

    public get children(): ProductBase[] {
        return this.subBrands.length ? this.subBrands : this.collections
    }

    public get description():string {
        return `Brand ${this.displayName}`
    }

    public load(json:any) {
        super.load(json)

        this.subBrands = []
        if (json.hasOwnProperty("brands")) {
            for (const brandJson of json.brands) {
                const brand = new ProductBrand()
                brand.load(brandJson)
                brand.parentBrand = this
                this.subBrands.push(brand)
            }
        }

        this.collections = []
        if (json.hasOwnProperty("collections")) {
            for (const collectionJson of json.collections) {
                const collection = new ProductCollection()
                collection.load(collectionJson)
                collection.brand = this
                this.collections.push(collection)
            }
        }
    }
}