import {ProductColor} from "./ProductColor";
import {SwatchItem} from "./SwatchItem";
import {ProductBase} from "./ProductBase";
import {ProductCollection} from "./ProductCollection";
import {ProductBrand} from "./ProductBrand";

export class Product extends ProductBase implements SwatchItem {
    public collection!: ProductCollection
    public colors: ProductColor[] = []

    public get brand(): ProductBrand {
        return this.collection.brand
    }

    public get parent():SwatchItem|undefined {
        return this.collection
    }

    public get children(): ProductBase[] {
        return this.colors
    }

    public get hasColumns(): boolean {
        return true
    }

    public load(json:any) {
        super.load(json)

        this.colors = []
        if (json.hasOwnProperty("colors")) {
            for (const colorJson of json.colors) {
                const color = new ProductColor()
                color.load(colorJson)
                color.product = this
                this.colors.push(color)
            }
        }
    }
}