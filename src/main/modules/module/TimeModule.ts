import { PIDSEditor } from "../../PIDSEditor";
import { TextModule } from "./TextModule";

export class TimeModule extends TextModule {
    public template: string = "%s:%s:%s %s";
    public baseTemplate: string = "%s:%s:%s %s";
    public show24Hour: boolean = false;
    public showHours: boolean = true;
    public showMinutes: boolean = true;
    public showSeconds: boolean = true;
    public loc: "g" | "s" = "s";
    public id = "time";

    protected getText(): string {
        let time = this.loc == "g" ? new Date(new Date().getTime() * 72 % (20 * 60 * 1000)) : new Date();
        let hours = time.getHours();
        let ampm = hours >= 12 ? "PM" : "AM";
        if (!this.show24Hour) {
            hours = hours % 12;
            hours = hours ? hours : 12;
        }
        this.template = this.baseTemplate;
        if (this.showHours) this.template = this.template.replace("%s", hours.toString());
        if (this.showMinutes) this.template = this.template.replace("%s", time.getMinutes().toString().padStart(2, "0"));
        if (this.showSeconds) this.template = this.template.replace("%s", time.getSeconds().toString().padStart(2, "0"));
        if (!this.show24Hour) this.template = this.template.replace("%s", ampm);
        return " ";
    }

    public getProperties(): { [key: string]: [(value: any, editor: PIDSEditor) => void, any] } {
        let properties: { [key: string]: [(value: any, editor: PIDSEditor) => void, any] } = {
            align: [(value: any) => this.setAlign(value), this.align],
            color: [(value: any) => this.setColor(value), this.color],
            text: [(value: any) => this.setBaseTemplate(value), this.baseTemplate],
            timeLoc: [(value: any, editor: PIDSEditor) => this.setLoc(value, editor), this.loc],
            show24Hour: [(value: any, editor: PIDSEditor) => this.setMode("24", value, editor), this.show24Hour],
            showMinutes: [(value: any, editor: PIDSEditor) => this.setMode("m", value, editor), this.showMinutes],
            showSeconds: [(value: any, editor: PIDSEditor) => this.setMode("s", value, editor), this.showSeconds],
            showHours: [(value: any, editor: PIDSEditor) => this.setMode("h", value, editor), this.showHours]
        };
        return properties;
    }

    public setBaseTemplate (template: any): void {
        if (typeof template == "string") this.baseTemplate = template;
    }

    public setLoc(loc: any, editor: PIDSEditor): void {
        if (loc == "s" || loc == "g") this.loc = loc;
        editor.edit.showProperties(editor);
    }

    public setMode(property: ("24" | "h" | "m" | "s"), mode: any, editor: PIDSEditor): void {
        if (typeof mode == "boolean") {
            switch (property) {
                case "24":
                    this.show24Hour = mode;
                    break;
                case "h":
                    this.showHours = mode;
                    break;
                case "m":
                    this.showMinutes = mode;
                    break;
                case "s":
                    this.showSeconds = mode;
                    break;
            }
        }
        editor.edit.showProperties(editor);
    }

    public export () {
        let toExport = super.export();
        let data = toExport.data;
        data.loc = this.loc;
        data.template = this.baseTemplate;
        data.show24Hour = this.show24Hour;
        data.showHours = this.showHours;
        data.showMinutes = this.showMinutes;
        data.showSeconds = this.showSeconds;
        return toExport;
    }

    public import(data: { [key: string]: any; }): void {
        super.import(data);
        if (["s", "g"].includes(data.loc)) this.loc = data.loc;
        if (typeof data.template == "string") this.baseTemplate = data.template;
        if (typeof data.show24Hour == "boolean") this.show24Hour = data.show24Hour;
        if (typeof data.showHours == "boolean") this.showHours = data.showHours;
        if (typeof data.showMinutes == "boolean") this.showMinutes = data.showMinutes;
        if (typeof data.showSeconds == "boolean") this.showSeconds = data.showSeconds;
    }

    public duplicate (): TextModule {
        let module = new (this.constructor as any)(this.x, this.y, this.width, this.height, this.name);
        module.align = this.align;
        module.color = this.color;
        module.layer = this.layer;
        module.loc = this.loc;
        module.template = this.template;
        module.show24Hour = this.show24Hour;
        module.showHours = this.showHours;
        module.showMinutes = this.showMinutes;
        module.showSeconds = this.showSeconds;
        return module;
    }
}