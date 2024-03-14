import { PIDSEditor } from "../PIDSEditor";
import { LayoutController } from "../controllers/LayoutController";
import { Arrival } from "../editor/Arrival";
import { RenderUtil } from "../util/RenderUtil";

export abstract class Module {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public name: string;

    constructor (x: number, y: number, width: number, height: number, name: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.name = name;
    }

    public abstract load (data: {[key: string]: any}): void;

    public render (ctx: CanvasRenderingContext2D, editor: PIDSEditor) {
        let util = editor.renderUtil;
        let layout = editor.layout;
        if (util.showBorder) {
            let scaledX = this.x * layout.pixelSize + layout.x;
            let scaledY = this.y * layout.pixelSize + layout.y;
            let scaledWidth = this.width * layout.pixelSize;
            let scaledHeight = this.height * layout.pixelSize;

            // draw module border
            if (!layout.showModuleBorders) return;
            ctx.fillStyle = editor.edit.selected === this ? "#ffaa00" : "#ffffff";
            ctx.textAlign = "left";
            ctx.fillRect(scaledX, scaledY, scaledWidth, 1);
            ctx.fillRect(scaledX, scaledY + scaledHeight - 1, scaledWidth, 1);
            ctx.fillRect(scaledX, scaledY, 1, scaledHeight);
            ctx.fillRect(scaledX + scaledWidth - 1, scaledY, 1, scaledHeight);
            ctx.fillStyle = "#ffffff";
            util.fontMono(ctx, "10px");
            ctx.fillText(this.name, scaledX + 2, scaledY + 2);
        }
    };
}