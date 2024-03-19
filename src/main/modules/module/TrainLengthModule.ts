import { Arrival } from "../../editor/Arrival";
import { TextModule } from "./TextModule";

export class TrainLengthModule extends TextModule {
    public template: string = "%s-car";
    public id = "trainLength";

    protected getText(arrivals: Arrival[]): string {
        let arrival = arrivals[this.arrival];
        return arrival.cars;
    }
}