import { FileAsset } from "../util/FileAsset";

export class AssetController {
    public images: {[key: string]: HTMLImageElement} = {};
    public files: {[key: string]: FileAsset} = {};

    public loadImage (id: string, src: string) {
        let image = new Image();
        image.src = src;
        this.images[id] = image;
    }

    public loadFile (id: string, src: string) {
        let file = new FileAsset(src);
        this.files[id] = file;
    }

    public async loadFiles () {
        //introduce some "natural" loading time
        for (let file of Object.keys(this.files)) {
            await this.files[file].load();
        }
    }

    public getLoaded () {
        let loaded = 0;
        for (let key in this.images) {
            if (this.images[key].complete) {
                loaded++;
            }
        }
        for (let key in this.files) {
            if (this.files[key].complete) {
                loaded++;
            }
        }
        return loaded;
    }

    public getTotal () {
        return Object.keys(this.images).length + Object.keys(this.files).length;
    }
}