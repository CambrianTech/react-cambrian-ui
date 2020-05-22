import {Product} from "./Product";
import {SwatchItem} from "./SwatchItem";
import {ProductBase} from "./ProductBase";
import {ProductCollection} from "./ProductCollection";
import {ProductBrand} from "./ProductBrand";

export class ProductColor extends ProductBase implements SwatchItem {
    public product!: Product
    public ppi?:number
    public scale?:number

    public get brand(): ProductBrand {
        return this.product.brand
    }

    public get collection(): ProductCollection {
        return this.product.collection
    }

    public get parent():SwatchItem|undefined {
        return this.product
    }

    public get children(): ProductBase[] {
        return []
    }

    public load(json:any) {
        super.load(json)
        if (json.hasOwnProperty("ppi")) {
            this.ppi = json.ppi
        }
        if (json.hasOwnProperty("scale")) {
            this.scale = json.scale
        }
    }
}