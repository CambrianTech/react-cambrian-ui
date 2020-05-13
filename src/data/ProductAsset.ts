import {ProductColor} from "./ProductColor";
import {SwatchItem} from "./SwatchItem";


export class ProductAsset implements SwatchItem {
    constructor(public productColor?: ProductColor, public json?: any) {

    }

    displayCode(): string|undefined {
        return undefined;
    }

    displayName(): string {
        return "";
    }

    thumbnailPath(): string|undefined {
        return "";
    }
}