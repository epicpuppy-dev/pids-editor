import { Arrival } from "../../util/Arrival";
import { TextModule } from "./TextModule";

export class LineNameModule extends TextModule {
    public template: string = "%s";
    public id = "lineName";

    protected getText(arrivals: Arrival[]): string {
        let arrival = arrivals[this.arrival];
        if (!arrival) return "";
        return arrival.lineName;
    }
}