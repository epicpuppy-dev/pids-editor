import { PIDSEditor } from "../../PIDSEditor";
import { Module } from "../Module";

export class BlockModule extends Module {
    public id: string = "text";
    public color: string = "#ffffff";

    public render(ctx: CanvasRenderingContext2D, editor: PIDSEditor): void {
        let layout = editor.layout;

        let scaledX = this.x * layout.pixelSize + layout.x;
        let scaledY = this.y * layout.pixelSize + layout.y;
        let scaledWidth = this.width * layout.pixelSize;
        let scaledHeight = this.height * layout.pixelSize;

        ctx.fillStyle = this.color;
        ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
        super.render(ctx, editor);
    }

    public getProperties(): { [key: string]: [(value: any, editor: PIDSEditor) => void, any] } {
        return {
            color: [(value: any) => this.setColor(value), this.color]
        }
    }

    public setColor (v: any): void {
        if (typeof v == "string") this.color = v;
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
                color: parseInt(this.color.slice(1), 16)
            }
        };
    }

    public import(data: { [key: string]: any; }): void {
        if (typeof data.color == "number") this.color = "#" + data.color.toString(16).padStart(6, "0");
    }

    public duplicate (): BlockModule {
        let module = new (this.constructor as any)(this.x, this.y, this.width, this.height, this.name);
        module.color = this.color;
        return module;
    }
}