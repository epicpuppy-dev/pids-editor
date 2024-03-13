import { Arrival } from "../../editor/Arrival";
import { TextModule } from "./TextModule";

export class ArrivalTimeModule extends TextModule {
    public template: string = "%s";
    public minuteTemplate: string = "%s min";
    public secondTemplate: string = "%s sec";
    public arriveTemplate: string = "%s";
    public mixedTemplate: string = "%s:%s";
    public mode: "mixed" | "individual" = "mixed";

    protected getText(arrivals: Arrival[]): string {
        let arrival = arrivals[this.arrival];
        let relTime = arrival.time - Date.now();
        let timeText = "";
        // if time until arrival is a minute or above
        if (relTime >= 60 * 1000 && this.mode == "individual") {    
            timeText = Math.floor(relTime / 60000).toString();
            this.template = this.minuteTemplate;
        }
        // if time until arrival is under a minute and over a second
        else if (relTime < 60 * 1000 && relTime >= 1000 && this.mode == "individual") {
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
}