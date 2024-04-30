import { Arrival } from "../../util/Arrival";
import { TextModule } from "./TextModule";

export class DestinationModule extends TextModule {
    public template: string = "%s";
    public id = "destination";

    protected getText(arrivals: Arrival[]): string {
        let arrival = arrivals[this.arrival];
        if (!arrival) return "";
        return arrival.destination;
    }
}