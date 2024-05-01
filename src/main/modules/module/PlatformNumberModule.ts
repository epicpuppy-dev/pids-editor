import { Arrival } from "../../util/Arrival";
import { TextModule } from "./TextModule";

export class PlatformNumberModule extends TextModule {
    public template: string = "%s";
    public id = "platformNumber";

    protected getText(arrivals: Arrival[]): string {
        let arrival = arrivals[this.arrival];
        if (!arrival) return "";
        return arrival.platform;
    }
}