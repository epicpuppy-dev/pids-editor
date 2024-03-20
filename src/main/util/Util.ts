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

    public drawTooltip (ctx: CanvasRenderingContext2D, editor: PIDSEditor, text: string[], fontSize: number = 12) {
        ctx.font = fontSize + "px monospace";
        ctx.textBaseline = "top";
        let lineSpacing = Math.floor(fontSize + 4);
        let maxwidth = ctx.measureText(text[0]).width;
        for (let i = 1; i < text.length; i++) {
            let width = ctx.measureText(text[i]).width;
            if (width > maxwidth) {
                maxwidth = width;
            }
        }
        let x = editor.mouse.x + 8;
        let y = editor.mouse.y + 5;
        if (x + maxwidth > editor.width) {
            x = editor.width - maxwidth - 8;
        }
        ctx.fillStyle = "#000000aa";
        ctx.fillRect(x, y, maxwidth + 8, 6 + text.length * lineSpacing);

        ctx.fillStyle = "#ffffff";
        for (let i = 0; i < text.length; i++) {
            ctx.fillText(text[i], x + 4, y + 6 + i * lineSpacing);
        }
    }

    public snapToGrid (pos: number, size: number, subdiv = 1, offset = 0) {
        return Math.round((pos - offset) / size * subdiv) * size / subdiv + offset;
    }
}