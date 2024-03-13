export class RenderUtil {
    public showBorder: boolean = true;

    public fontMono (ctx: CanvasRenderingContext2D, size: string) {
        ctx.textBaseline = "top";
        ctx.font = size + " 'Consolas','Courier New',monospace";
    }

    public fontMC (ctx: CanvasRenderingContext2D, size: string) {
        ctx.textBaseline = "top";
        ctx.font = size + " 'Minecraft','Consolas','Courier New',monospace"
    }
}