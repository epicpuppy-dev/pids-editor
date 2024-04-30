import { PIDSEditor } from "../../PIDSEditor";
import { Arrival } from "../../util/Arrival";
import { TextModule } from "./TextModule";

export class StopsAtModule extends TextModule {
    public template: string = "%s";
    public baseTemplate: string = "%s";
    public id = "stopsAt";
    public mode: "s" | "l" = "l"; // s = scroll, l = list
    public hasPage: boolean = false;
    public stop: number = 0;
    public stopIncrement: number = 1;
    public scrollSpeed: number = 5; // measured in block pixles per second
    private editor: PIDSEditor;
    private canvas: OffscreenCanvas;
    private ctx: OffscreenCanvasRenderingContext2D;

    constructor(x: number, y: number, width: number, height: number, name: string, editor: PIDSEditor) {
        super(x, y, width, height, name);
        this.editor = editor;
        this.canvas = new OffscreenCanvas(width * editor.layout.pixelSize, height * editor.layout.pixelSize);
        this.ctx = this.canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
    }

    public render(ctx: CanvasRenderingContext2D, editor: PIDSEditor): void {
        if (this.mode == "s") {
            this.canvas.width = (this.width - 0.5) * editor.layout.pixelSize;
            this.canvas.height = (this.height - 0.25) * editor.layout.pixelSize;
            editor.util.fontMC(this.ctx, ((this.height - 0.125) * editor.layout.pixelSize) + "px");
            let text = this.template.replace("%s", this.getText(editor.arrivals.arrivals));
            let width = this.ctx.measureText(text).width + this.width * editor.layout.pixelSize;
            // convert block pixels per second to screen pixels per frame
            let scrollSpeed = this.scrollSpeed * editor.layout.pixelSize / 60;
            let animationTime = width / scrollSpeed;
            let time = editor.edit.time % animationTime;
            let x = Math.floor(-(time / animationTime) * width + this.width * editor.layout.pixelSize);
            this.ctx.fillStyle = this.color;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillText(text, x, 0);
            ctx.drawImage(this.canvas, (this.x + 0.25) * editor.layout.pixelSize + editor.layout.x, (this.y + 0.125) * editor.layout.pixelSize + editor.layout.y);
            super.render(ctx, editor, false);
        } else {
            super.render(ctx, editor);
        }
    }

    protected getText(arrivals: Arrival[]): string {
        let arrival = arrivals[this.arrival];
        if (!arrival) return "";
        if (this.mode == "l") {
            let pages = Math.ceil(arrival.stops.length / this.stopIncrement);
            let currentPage = Math.floor(this.editor.edit.ticks / 60) % pages;

            if (this.hasPage) this.template = this.baseTemplate.replace("%s", (currentPage + 1).toString()).replace("%s", pages.toString());
            else this.template = this.baseTemplate;

            if (arrival.stops.length <= this.stop + currentPage * this.stopIncrement) return "";
            return arrival.stops[this.stop + currentPage * this.stopIncrement].name;
        } else {
            this.template = this.baseTemplate;
            let text = "";
            for (let i = 0; i < arrival.stops.length; i++) {
                if (i != 0 && i == arrival.stops.length - 1) {
                    text += "and ";
                }
                text += arrival.stops[i].name;
                if (i != arrival.stops.length - 1) {
                    text += ", ";
                }
            }
            return text;
        }
    }

    public getProperties(): { [key: string]: [(value: any, editor: PIDSEditor) => void, any] } {
        let properties: { [key: string]: [(value: any, editor: PIDSEditor) => void, any] } = {
            arrival: [(value: any) => this.setArrival(value), this.arrival + 1],
            align: [(value: any) => this.setAlign(value), this.align],
            text: [(value: any) => this.setBaseTemplate(value), this.baseTemplate],
            color: [(value: any) => this.setColor(value), this.color],
            stopsType: [(value: any, editor) => this.setMode(value, editor), this.mode],
        };
        if (this.mode == "s") {
            properties.scrollSpeed = [(value: any) => this.setScrollSpeed(value), this.scrollSpeed];
        } else {
            properties.hasPage = [(value: any) => this.setHasPage(value), this.hasPage];
            properties.stop = [(value: any, editor) => this.setStop(value, editor), this.stop + 1];
        };
        return properties;
    }

    public setBaseTemplate (template: any): void {
        if (typeof template == "string") this.baseTemplate = template;
    }

    public setMode(mode: any, editor: PIDSEditor): void {
        if (mode == "s" || mode == "l") this.mode = mode;
        editor.edit.showProperties(editor);
    }

    public setScrollSpeed(speed: any): void {
        //check for number
        if (typeof speed != "number" && typeof speed != "string") return;
        let num;
        if (typeof speed == "string") {
            num = parseInt(speed);
        } else {
            num = speed;
        }
        if (isNaN(num)) return;
        if (num < 1) num = 1;
        this.scrollSpeed = num;
    }

    public setHasPage(hasPage: any): void {
        if (typeof hasPage == "boolean") this.hasPage = hasPage;
    }

    public setStop(stop: any, editor: PIDSEditor): void {
        //check for number
        if (typeof stop != "number" && typeof stop != "string") return;
        let num;
        if (typeof stop == "string") {
            num = parseInt(stop);
        } else {
            num = stop;
        }
        if (isNaN(num)) return;
        if (num < 1) num = 1;
        this.stop = num - 1;

        // recaclulate stops per page
        let maxStop = this.stop;
        for (const module of editor.modules.modules) {
            if (module instanceof StopsAtModule) {
                maxStop = Math.max(maxStop, module.stop);
            }
        }

        // set stops per page
        for (const module of editor.modules.modules) {
            if (module instanceof StopsAtModule) {
                module.stopIncrement = maxStop + 1;
            }
        }
    }

    public export () {
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
                arrival: this.arrival,
                mode: this.mode,
                template: this.baseTemplate,
                showPage: this.hasPage,
                stop: this.stop,
                stopIncrement: this.stopIncrement,
                scrollSpeed: this.scrollSpeed
            }
        };
    }

    public import(data: { [key: string]: any; }): void {
        if (["left", "right", "center"].includes(data.align)) this.align = data.align;
        if (typeof data.color == "number") this.color = "#" + data.color.toString(16).padStart(6, "0");
        if (typeof data.arrival == "number") this.arrival = data.arrival;
        if (["s", "l"].includes(data.mode)) this.mode = data.mode;
        if (typeof data.template == "string") this.baseTemplate = data.template;
        if (typeof data.baseText == "string") this.baseTemplate = data.baseText;
        if (typeof data.showPage == "boolean") this.hasPage = data.showPage;
        if (typeof data.stop == "number") this.stop = data.stop;
        if (typeof data.stopIncrement == "number") this.stopIncrement = data.stopIncrement;
        if (typeof data.scrollSpeed == "number") this.scrollSpeed = data.scrollSpeed;
    }

    public duplicate (): TextModule {
        let module = new (this.constructor as any)(this.x, this.y, this.width, this.height, this.name, this.editor);
        module.align = this.align;
        module.color = this.color;
        module.arrival = this.arrival;
        module.mode = this.mode;
        module.hasPage = this.hasPage;
        module.stop = this.stop;
        module.stopIncrement = this.stopIncrement;
        module.scrollSpeed = this.scrollSpeed;
        return module;
    }
}