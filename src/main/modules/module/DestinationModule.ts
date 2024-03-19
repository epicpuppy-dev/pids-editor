import { Arrival } from "../../editor/Arrival";
import { TextModule } from "./TextModule";

export class DestinationModule extends TextModule {
    public template: string = "%s";
    public id = "destination";

    protected getText(arrivals: Arrival[]): string {
        let arrival = arrivals[this.arrival];
        return arrival.destination;
    }
}