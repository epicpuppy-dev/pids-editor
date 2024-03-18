import { PIDSEditor } from "../PIDSEditor";
import { AssetController } from "../controllers/AssetController";
import { ModuleController } from "../controllers/ModuleController";
import { ModuleType } from "../modules/ModuleType";
import { ArrivalTimeModule } from "../modules/module/ArrivalTimeModule";
import { DestinationModule } from "../modules/module/DestinationModule";
import { TrainLengthModule } from "../modules/module/TrainLengthModule";

export class ModuleData {
    public static registerModules (editor: PIDSEditor) {
        let controller = editor.modules;
        let assets = editor.assets;
        //define modules below
        controller.registerModuleType(new ModuleType(
            "destination",
            "Destination",
            (x, y, w, h) => {
                return new DestinationModule(x, y, w, h, "Destination");
            },
            assets.sprites.destination
        ), editor);
        controller.registerModuleType(new ModuleType(
            "arrivalTime",
            "Arrival Time",
            (x, y, w, h) => {
                return new ArrivalTimeModule(x, y, w, h, "Arrival Time");
            },
            assets.sprites.arrivalTime
        ), editor);
        controller.registerModuleType(new ModuleType(
            "trainLength",
            "Train Length",
            (x, y, w, h) => {
                return new TrainLengthModule(x, y, w, h, "Train Length");
            },
            assets.sprites.trainLength
        ), editor);
        controller.registerModuleType(new ModuleType(
            "platformNumber",
            "Platform Number",
            (x, y, w, h) => {
                return new TrainLengthModule(x, y, w, h, "Platform Number");
            },
            assets.sprites.platformNumber
        ), editor);
    }
}