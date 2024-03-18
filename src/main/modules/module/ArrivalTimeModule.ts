import { PIDSEditor } from "../../PIDSEditor";
import { Arrival } from "../../editor/Arrival";
import { TextModule } from "./TextModule";

export class ArrivalTimeModule extends TextModule {
    public template: string = "%s";
    public minuteTemplate: string = "%s min";
    public secondTemplate: string = "%s sec";
    public arriveTemplate: string = "%s";
    public mixedTemplate: string = "%s:%s";
    public mode: "b" | "i" = "i";

    protected getText(arrivals: Arrival[]): string {
        let arrival = arrivals[this.arrival];
        let relTime = arrival.time - Date.now();
        let timeText = "";
        // if time until arrival is a minute or above
        if (relTime >= 60 * 1000 && this.mode == "i") {    
            timeText = Math.floor(relTime / 60000).toString();
            this.template = this.minuteTemplate;
        }
        // if time until arrival is under a minute and over a second
        else if (relTime < 60 * 1000 && relTime >= 1000 && this.mode == "i") {
            timeText = Math.floor(relTime / 1000).toString();
            this.template = this.secondTemplate;
        }
        else if (relTime >= 1000) {
            timeText = Math.floor(relTime / 60000).toString();
            //replace minutes
            this.template = this.mixedTemplate.replace("%s", timeText);
            timeText = Math.floor((relTime % 60000) / 1000).toString().padStart(2, "0");
        }
        // if time until arrival is under a second
        else {
            this.template = this.arriveTemplate;
        }
        return timeText;
    }

    public getProperties(): { [key: string]: [(value: any, editor: PIDSEditor) => void, any] } {
        let properties: { [key: string]: [(value: any, editor: PIDSEditor) => void, any] } = {
            arrival: [(value: any) => this.setArrival(value), this.arrival + 1],
            align: [(value: any) => this.setAlign(value), this.align],
            color: [(value: any) => this.setColor(value), this.color],
            timeType: [(value: any, editor: PIDSEditor) => this.setMode(value, editor), this.mode]
        };
        if (this.mode == "i") {
            properties.minText = [(value: any) => this.setMinText(value), this.minuteTemplate];
            properties.secText = [(value: any) => this.setSecText(value), this.secondTemplate];
        } else {
            properties.mixText = [(value: any) => this.setMixText(value), this.mixedTemplate];
        };
        return properties;
    }

    public setMode(mode: any, editor: PIDSEditor): void {
        if (mode == "i" || mode == "b") this.mode = mode;
        editor.edit.showProperties(editor);
    }

    public setMinText(text: any): void {
        if (typeof text == "string") this.minuteTemplate = text;
        console.log(this.minuteTemplate);
    }

    public setSecText(text: any): void {
        if (typeof text == "string") this.secondTemplate = text;
    }

    public setMixText(text: any): void {
        if (typeof text == "string") this.mixedTemplate = text;
    }
}