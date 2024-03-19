import { Arrival } from "../../editor/Arrival";
import { TextModule } from "./TextModule";

export class PlatformNumberModule extends TextModule {
    public template: string = "%s";
    public id = "platformNumber";

    protected getText(arrivals: Arrival[]): string {
        let arrival = arrivals[this.arrival];
        return arrival.platform;
    }
}