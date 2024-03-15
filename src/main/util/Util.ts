export class Util {
    public showBorder: boolean = true;

    public fontMono (ctx: CanvasRenderingContext2D, size: string) {
        ctx.textBaseline = "top";
        ctx.font = size + " 'Consolas','Courier New',monospace";
    }

    public fontMC (ctx: CanvasRenderingContext2D, size: string) {
        ctx.textBaseline = "top";
        ctx.font = size + " 'Minecraft','Consolas','Courier New',monospace"
    }

    public pointInBox (x: number, y: number, bx: number, by: number, bw: number, bh: number) {
        return x >= bx && x < bx + bw && y >= by && y < by + bh;
    }
}