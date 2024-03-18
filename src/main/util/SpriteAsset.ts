export class SpriteAsset {
    public complete: boolean = false;
    public src: string;
    public img: HTMLImageElement;

    constructor(src: string) {
        this.src = src;
        this.img = new HTMLImageElement();
    }

    public async load() {
        this.img.src = this.src;
        await new Promise<void>(resolve => {
            window.setInterval(() => {if (this.img.complete) resolve()}, 20);
        });
    }
}