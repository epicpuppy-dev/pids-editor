import { PIDSEditor } from "../../PIDSEditor";
import { Module } from "../Module";

export class BlockModule extends Module {
    public id: string = "block";
    public colorMode: string = "basic";
    public color: string = "#ffffff";
    public layer: number = 0;
    public arrival: number = 0;

    public render(ctx: CanvasRenderingContext2D, editor: PIDSEditor): void {
        let layout = editor.layout;

        let scaledX = this.x * layout.pixelSize + layout.x;
        let scaledY = this.y * layout.pixelSize + layout.y;
        let scaledWidth = this.width * layout.pixelSize;
        let scaledHeight = this.height * layout.pixelSize;
        let arrivals = editor.arrivals.arrivals;

        let color = "#ffffff";
        if (this.colorMode == "line" && arrivals[this.arrival]) color = arrivals[this.arrival].lineColor;
        else if (this.colorMode == "station") color = editor.edit.stationColor;
        else if (this.colorMode == "basic") color = this.color;

        ctx.fillStyle = color;
        ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
        super.render(ctx, editor);
    }

    public getProperties(): { [key: string]: [(value: any, editor: PIDSEditor) => void, any] } {
        return {
            color: [(value: any) => this.setColor(value), this.colorMode == "basic" ? this.color : this.colorMode],
            arrival: [(value: any) => this.setArrival(value), this.arrival + 1],
        }
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
                color: parseInt(this.color.slice(1), 16),
                layer: this.layer,
                arrival: this.arrival
            }
        };
    }

    public import(data: { [key: string]: any; }): void {
        if (typeof data.color == "number") this.color = "#" + data.color.toString(16).padStart(6, "0");
        if (typeof data.layer == "number") this.layer = data.layer;
        if (typeof data.arrival == "number") this.arrival = data.arrival;
    }

    public duplicate (): BlockModule {
        let module = new (this.constructor as any)(this.x, this.y, this.width, this.height, this.name);
        module.color = this.color;
        module.layer = this.layer;
        module.arrival = this.arrival;
        return module;
    }
}