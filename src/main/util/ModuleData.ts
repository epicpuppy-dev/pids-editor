import { PIDSEditor } from "../PIDSEditor";
import { ModuleType } from "../modules/ModuleType";
import { ArrivalTimeModule } from "../modules/module/ArrivalTimeModule";
import { BlockModule } from "../modules/module/BlockModule";
import { DestinationModule } from "../modules/module/DestinationModule";
import { LineNameModule } from "../modules/module/LineNameModule";
import { LineNumberModule } from "../modules/module/LineNumberModule";
import { PlatformNumberModule } from "../modules/module/PlatformNumberModule";
import { StopsAtModule } from "../modules/module/StopsAtModule";
import { TemplateModule } from "../modules/module/TemplateModule";
import { TextModule } from "../modules/module/TextModule";
import { TimeModule } from "../modules/module/TimeModule";
import { TrainLengthModule } from "../modules/module/TrainLengthModule";

export class ModuleData {
    public static registerModules (editor: PIDSEditor) {
        let controller = editor.modules;
        let assets = editor.assets;
        //define modules below
        controller.registerModuleType(new ModuleType(
            "destination",
            "{{module.destination}}",
            (x, y, w, h) => {
                return new DestinationModule(x, y, w, h, "{{module.destination}}");
            },
            assets.sprites.destination
        ), editor);
        controller.registerModuleType(new ModuleType(
            "arrivalTime",
            "{{module.arrivalTime}}",
            (x, y, w, h) => {
                return new ArrivalTimeModule(x, y, w, h, "{{module.arrivalTime}}");
            },
            assets.sprites.arrivalTime
        ), editor);
        controller.registerModuleType(new ModuleType(
            "trainLength",
            "{{module.trainLength}}",
            (x, y, w, h) => {
                return new TrainLengthModule(x, y, w, h, "{{module.trainLength}}");
            },
            assets.sprites.trainLength
        ), editor);
        controller.registerModuleType(new ModuleType(
            "platformNumber",
            "{{module.platformNum}}",
            (x, y, w, h) => {
                return new PlatformNumberModule(x, y, w, h, "{{module.platformNum}}");
            },
            assets.sprites.platformNumber
        ), editor);
        controller.registerModuleType(new ModuleType(
            "stopsAt",
            "{{module.stopsAt}}",
            (x, y, w, h) => {
                return new StopsAtModule(x, y, w, h, "{{module.stopsAt}}", editor);
            },
            assets.sprites.stopsAt
        ), editor);
        controller.registerModuleType(new ModuleType(
            "lineName",
            "{{module.lineName}}",
            (x, y, w, h) => {
                return new LineNameModule(x, y, w, h, "{{module.lineName}}");
            },
            assets.sprites.lineName
        ), editor);
        controller.registerModuleType(new ModuleType(
            "lineNumber",
            "{{module.lineNum}}",
            (x, y, w, h) => {
                return new LineNumberModule(x, y, w, h, "{{module.lineNum}}");
            },
            assets.sprites.lineNumber
        ), editor);
        controller.registerModuleType(new ModuleType(
            "time",
            "Time",
            (x, y, w, h) => {
                return new TimeModule(x, y, w, h, "Time");
            },
            assets.sprites.time
        ), editor, true);
        controller.registerModuleType(new ModuleType(
            "text",
            "{{module.text}}",
            (x, y, w, h) => {
                return new TextModule(x, y, w, h, "{{module.text}}");
            },
            assets.sprites.text
        ), editor);
        controller.registerModuleType(new ModuleType(
            "template",
            "{{module.template}}",
            (x, y, w, h) => {
                return new TemplateModule(x, y, w, h, "{{module.template}}");
            },
            assets.sprites.template
        ), editor);
        controller.registerModuleType(new ModuleType(
            "block",
            "{{module.block}}",
            (x, y, w, h) => {
                return new BlockModule(x, y, w, h, "{{module.block}}");
            },
            assets.sprites.block
        ), editor);
    }
}