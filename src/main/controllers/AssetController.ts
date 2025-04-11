import { FileAsset } from "../util/FileAsset";
import { LiteralAsset } from "../util/LiteralAsset";
import { SpriteAsset } from "../util/SpriteAsset";

export class AssetController {
    public sprites: {[key: string]: SpriteAsset} = {};
    public files: {[key: string]: FileAsset} = {};
    public loading: string = "";

    public loadSprite (id: string, src: string) {
        console.log(src);
        let sprite = new SpriteAsset(src);
        this.sprites[id] = sprite;
    }

    public loadFile (id: string, src: string) {
        let file = new FileAsset(src);
        this.files[id] = file;
    }

    public loadLiteral (id: string, data: string) {
        let file = new LiteralAsset("", data);
        this.files[id] = file;
    }

    public async loadAll () {
        //load sprites
        for (let sprite of Object.keys(this.sprites)) {
            let url = new URL(this.sprites[sprite].src);
            this.sprites[sprite].load();
        }
        //load files
        for (let file of Object.keys(this.files)) {
            let url = new URL(this.files[file].src);
            this.files[file].load();
        }
    }

    public getLoaded () {
        let loaded = 0;
        for (let key in this.sprites) {
            if (this.sprites[key].complete) {
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
        return Object.keys(this.sprites).length + Object.keys(this.files).length;
    }
}