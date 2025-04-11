import { FileAsset } from "./FileAsset";

export class LiteralAsset extends FileAsset {
    constructor(src: string, data: string) {
        super(src);
        this.data = data;
        this.complete = true;
    }

    public async load() {
        return;
    }
}