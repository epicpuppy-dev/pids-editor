import { PIDSEditor } from "../../PIDSEditor";
import { Arrival } from "../../util/Arrival";
import { TextModule } from "./TextModule";

export class TemplateModule extends TextModule {
    public template: string = "Text";
    public baseTemplate: string = "Text";
    public id = "template";

    protected getText(arrivals: Arrival[]): string {
        let arrival = arrivals[this.arrival];
        if (!arrival) return "";

        let time = new Date();
        let hours = time.getHours();
        let hours12 = hours % 12;
        hours12 = hours12 ? hours12 : 12;
        let ampm = hours >= 12 ? "PM" : "AM";

        this.template = this.baseTemplate
            .replaceAll("$s", arrival.station)
            .replaceAll("$d", arrival.destination)
            .replaceAll("$p", arrival.platform)
            .replaceAll("$l", arrival.cars)
            .replaceAll("$n", arrival.lineName)
            //Time Identifiers
            .replaceAll("$ts", time.getSeconds().toString().padStart(2, "0"))
            .replaceAll("$tm", time.getMinutes().toString().padStart(2, "0"))
            .replaceAll("$th2", hours12.toString())
            .replaceAll("$th4", hours.toString())
            .replaceAll("$tap", ampm);

        return " ";
    }

    public getProperties(): { [key: string]: [(value: any, editor: PIDSEditor) => void, any] } {
        return {
            arrival: [(value: any) => this.setArrival(value), this.arrival + 1],
            align: [(value: any) => this.setAlign(value), this.align],
            color: [(value: any) => this.setColor(value), this.color],
            text: [(value: any) => this.setTemplate(value), this.baseTemplate],
            identifiers: [() => {}, null]
        }
    }

    public setTemplate(template: any): void {
        if (typeof template == "string") this.baseTemplate = template;
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
                color: parseInt(this.color.slice(1), 16),
                layer: this.layer,
                arrival: this.arrival,
                template: this.baseTemplate
            }
        };
    }

    public import(data: { [key: string]: any; }): void {
        if (["left", "right", "center"].includes(data.align)) this.align = data.align;
        if (typeof data.color == "number") this.color = "#" + data.color.toString(16).padStart(6, "0");
        if (typeof data.arrival == "number") this.arrival = data.arrival;
        if (typeof data.layer == "number") this.layer = data.layer;
        if (typeof data.template == "string") this.baseTemplate = data.template;
    }

    public duplicate (): TextModule {
        let module = new (this.constructor as any)(this.x, this.y, this.width, this.height, this.name);
        module.align = this.align;
        module.color = this.color;
        module.layer = this.layer;
        module.arrival = this.arrival;
        module.baseTemplate = this.baseTemplate;
        return module;
    }
}