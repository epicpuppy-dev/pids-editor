export class FileAsset {
    public complete: boolean = false;
    public src: string;
    public data: string | null = null;

    constructor(src: string) {
        this.src = src;
    }

    public async load() {
        let response = await fetch(this.src);
        this.data = await response.text();
        this.complete = true;
        await new Promise<void>((resolve) => {
            window.setTimeout(resolve, Math.floor(Math.random() * 50));
        });

    }
}