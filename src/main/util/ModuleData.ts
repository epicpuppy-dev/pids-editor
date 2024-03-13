import { ModuleController } from "../controllers/ModuleController";
import { ModuleType } from "../modules/ModuleType";
import { ArrivalTimeModule } from "../modules/module/ArrivalTimeModule";
import { DestinationModule } from "../modules/module/DestinationModule";
import { TrainLengthModule } from "../modules/module/TrainLengthModule";

export class ModuleData {
    public static registerModules (controller: ModuleController) {
        //define modules below
        controller.registerModuleType(new ModuleType(
            "destination",
            "Destination",
            (x, y, w, h) => {
                return new DestinationModule(x, y, w, h, "Destination");
            },
            [160, 0, 32, 32]
        ));
        controller.registerModuleType(new ModuleType(
            "arrivalTime",
            "Arrival Time",
            (x, y, w, h) => {
                return new ArrivalTimeModule(x, y, w, h, "Arrival Time");
            },
            [192, 0, 32, 32]
        ));
        controller.registerModuleType(new ModuleType(
            "trainLength",
            "Train Length",
            (x, y, w, h) => {
                return new TrainLengthModule(x, y, w, h, "Train Length");
            },
            [224, 0, 32, 32]
        ));
        controller.registerModuleType(new ModuleType(
            "platformNumber",
            "Platform Number",
            (x, y, w, h) => {
                return new TrainLengthModule(x, y, w, h, "Platform Number");
            },
            [0, 32, 32, 32]
        ));
    }
}