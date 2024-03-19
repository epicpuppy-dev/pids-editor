import { PIDSEditor } from "../PIDSEditor";

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

    public drawOccupiedBox (ctx: CanvasRenderingContext2D, editor: PIDSEditor, x: number, y: number, w: number, h: number, fill: boolean = false) {
        let px = x * editor.layout.pixelSize + editor.layout.x;
        let py = y * editor.layout.pixelSize + editor.layout.y;
        let pw = w * editor.layout.pixelSize;
        let ph = h * editor.layout.pixelSize;
        if (fill) {
            ctx.fillRect(px, py, pw, ph);
        }
        ctx.beginPath();
        ctx.rect(px, py, pw, ph);
        ctx.moveTo(px, py);
        ctx.lineTo(px + pw, py + ph);
        ctx.moveTo(px + pw, py);
        ctx.lineTo(px, py + ph);
        ctx.stroke();
    }
}