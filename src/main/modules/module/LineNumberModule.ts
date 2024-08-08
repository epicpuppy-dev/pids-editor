import { Arrival } from "../../util/Arrival";
import { TextModule } from "./TextModule";

export class LineNumberModule extends TextModule {
    public template: string = "%s";
    public id = "lineNumber";

    protected getText(arrivals: Arrival[]): string {
        let arrival = arrivals[this.arrival];
        if (!arrival) return "";
        return arrival.lineNumber;
    }
}