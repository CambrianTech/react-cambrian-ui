import {ProductColor} from "./ProductColor";
import {SwatchItem, SwatchListing} from "./SwatchItem";
import {ProductBase} from "./ProductBase";

export class Product extends ProductBase implements SwatchItem, SwatchListing {
    constructor(public product?: Product, json?: any) {
        super(json)
    }

    public colors: ProductColor[] = []

    public get children(): SwatchItem[] {
        return this.colors
    }

    public load(json:any) {
        super.load(json)

        this.colors = []
        if (json.hasOwnProperty("colors")) {
            for (const color of json.colors) {
                this.colors.push(new ProductColor(color))
            }
        }
    }
}