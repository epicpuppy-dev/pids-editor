import { PIDSEditor } from "../../PIDSEditor";
import { Arrival } from "../../util/Arrival";
import { Module } from "../Module";

export class TextModule extends Module {
    public id: string = "text";
    public align: ("left" | "right" | "center") = "left";
    public colorMode: string = "basic";
    public color: string = "#ffffff";
    public arrival: number = 0;
    public template: string = "Text";
    public layer: number = 1;

    public static SWITCH_TICKS: number = 60;

    protected getText (arrivals: Arrival[]): string {return " "};

    public render(ctx: CanvasRenderingContext2D, editor: PIDSEditor, render: boolean = true): void {
        if (!render) {
            super.render(ctx, editor);
            return;
        }
        let arrivals = editor.arrivals.arrivals;
        let util = editor.util;
        let layout = editor.layout;

        let text = this.getText(arrivals).split("||")[0];
        if (text.length == 0) {
            super.render(ctx, editor);
            return;
        }
        //translations
        let texts = text.replaceAll("\\|", "^TEMP^").split("|");
        let tx = Math.floor(editor.edit.ticks / TextModule.SWITCH_TICKS) % texts.length;
        text = texts[tx].replaceAll("^TEMP^", "|");
        let templates = this.template.replaceAll("\\|", "^TEMP^").split("|");
        let tp = Math.floor(editor.edit.ticks / TextModule.SWITCH_TICKS) % templates.length;
        text = templates[tp].replaceAll("^TEMP^", "|").replace("%s", text);

        let scaledX = (this.x + 0.25) * layout.pixelSize + layout.x;
        let scaledY = (this.y + 0.125) * layout.pixelSize + layout.y;
        let scaledWidth = (this.width - 0.375) * layout.pixelSize;

        let color = "#ffffff";
        if (this.colorMode == "line" && arrivals[this.arrival]) color = arrivals[this.arrival].lineColor;
        else if (this.colorMode == "station") color = editor.edit.stationColor;
        else if (this.colorMode == "basic") color = this.color;
        ctx.fillStyle = color;
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
            color: [(value: any) => this.setColor(value), this.colorMode == "basic" ? this.color : this.colorMode],
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
        //if value is hex, set mode to basic
        if (typeof v == "string" && /^#[0-9a-fA-F]{6}$/.test(v)) {
            this.colorMode = "basic";
            this.color = v;
        } else if (["line", "station"].includes(v)) {
            this.colorMode = v;
        }
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
                colorMode: this.colorMode,
                color: parseInt(this.color.slice(1), 16),
                arrival: this.arrival,
                template: this.template,
                layer: this.layer
            }
        };
    }

    public import(data: { [key: string]: any; }): void {
        if (["left", "right", "center"].includes(data.align)) this.align = data.align;
        if (["basic", "line", "station"].includes(data.colorMode)) this.colorMode = data.colorMode;
        if (typeof data.color == "number") this.color = "#" + data.color.toString(16).padStart(6, "0");
        if (typeof data.arrival == "number") this.arrival = data.arrival;
        if (typeof data.template == "string") this.template = data.template;
        if (typeof data.layer == "number") this.layer = data.layer;
    }

    public duplicate (): TextModule {
        let module = new (this.constructor as any)(this.x, this.y, this.width, this.height, this.name);
        module.align = this.align;
        module.colorMode = this.colorMode;
        module.color = this.color;
        module.arrival = this.arrival;
        module.template = this.template;
        return module;
    }
}