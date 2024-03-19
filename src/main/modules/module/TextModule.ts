import { PIDSEditor } from "../../PIDSEditor";
import { Arrival } from "../../editor/Arrival";
import { Module } from "../Module";

export abstract class TextModule extends Module {
    public align: ("left" | "right" | "center") = "left";
    public color: string = "#ffffff";
    public arrival: number = 0;
    public abstract template: string;

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

    public getProperties(): { [key: string]: [(value: any, editor: PIDSEditor) => void, any] } {
        return {
            arrival: [(value: any) => this.setArrival(value), this.arrival + 1],
            align: [(value: any) => this.setAlign(value), this.align],
            color: [(value: any) => this.setColor(value), this.color],
            text: [(value: any) => this.setTemplate(value), this.template]
        }
    }

    public setArrival (v: any): void {
        //check for number
        if (typeof v != "number" && typeof v != "string") return;
        let num;
        if (typeof v == "string") {
            num = parseInt(v);
        } else {
            num = v;
        }
        if (isNaN(num)) return;
        if (num < 1) num = 1;
        this.arrival = num - 1;
    }

    public setAlign (v: any): void {
        if (["left", "right", "center"].includes(v)) this.align = v;
    }

    public setColor (v: any): void {
        if (typeof v == "string") this.color = v;
    }

    public setTemplate (v: any): void {
        if (typeof v == "string") this.template = v;
    }

    public export (): {
        typeID: string,
        pos: {
            x: number,
            y: number,
            w: number,
            h: number
        },
        data: {[key: string]: any}
    } {
        return {
            typeID: this.id,
            pos: {
                x: this.x,
                y: this.y,
                w: this.width,
                h: this.height
            },
            data: {
                align: this.align,
                color: this.color,
                arrival: this.arrival,
                template: this.template
            }
        };
    }

    public import(data: { [key: string]: any; }): void {
        if (["left", "right", "center"].includes(data.align)) this.align = data.align;
        if (typeof data.color == "string") this.color = data.color;
        if (typeof data.arrival == "number") this.arrival = data.arrival;
        if (typeof data.template == "string") this.template = data.template;
    }

    public duplicate (): TextModule {
        let module = new (this.constructor as any)(this.x, this.y, this.width, this.height);
        module.align = this.align;
        module.color = this.color;
        module.arrival = this.arrival;
        module.template = this.template;
        return module;
    }
}