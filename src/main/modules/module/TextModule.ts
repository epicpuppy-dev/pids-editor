import { PIDSEditor } from "../../PIDSEditor";
import { LayoutController } from "../../controllers/LayoutController";
import { Arrival } from "../../editor/Arrival";
import { Util } from "../../util/Util";
import { Module } from "../Module";

export abstract class TextModule extends Module {
    public align: ("left" | "right" | "center") = "left";
    public color: string = "#ffffff";
    public arrival: number = 0;
    public abstract template: string;

    public load(data: { [key: string]: any; }): void {
        if (["left", "right", "center"].includes(data.align)) this.align = data.align;
        if (typeof data.color == "string") this.color = data.color;
        if (typeof data.arrival == "number") this.arrival = data.arrival;
    }

    protected abstract getText (arrivals: Arrival[]): string;

    public render(ctx: CanvasRenderingContext2D, editor: PIDSEditor): void {
        let arrivals = editor.arrivals.arrivals;
        let util = editor.util;
        let layout = editor.layout;

        let text = this.getText(arrivals);
        text = this.template.replace("%s", text);

        let scaledX = (this.x + 0.25) * layout.pixelSize + layout.x;
        let scaledY = (this.y + 0.125) * layout.pixelSize + layout.y;
        let scaledWidth = (this.width - 0.375) * layout.pixelSize;

        ctx.fillStyle = this.color;
        ctx.textAlign = this.align;
        util.fontMC(ctx, ((this.height - 0.125) * layout.pixelSize) + "px");

        //alignment
        if (this.align == "center") {
            scaledX += Math.floor(scaledWidth / 2);
        } else if (this.align == "right") {
            scaledX += Math.floor(scaledWidth);
        }

        //check overflow
        ctx.save();
        ctx.translate(scaledX, scaledY);
        let textWidth = ctx.measureText(text).width;
        if (textWidth > scaledWidth) {
            ctx.scale((scaledWidth) / textWidth, 1);
        }

        ctx.fillText(text, 0, 0);
        ctx.restore();
        super.render(ctx, editor);
    }
}