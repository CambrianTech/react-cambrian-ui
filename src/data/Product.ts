import {ProductColor} from "./ProductColor";
import {SwatchItem, SwatchListing} from "./SwatchItem";
import {ProductBase} from "./ProductBase";
import {ProductCollection} from "./ProductCollection";

export class Product extends ProductBase implements SwatchItem, SwatchListing {
    public collection?: ProductCollection
    public colors: ProductColor[] = []

    public get children(): SwatchItem[] {
        return this.colors
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