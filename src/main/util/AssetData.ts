import { AssetController } from "../controllers/AssetController";
import destination from "../../res/sprite-destination.png";
import arrivalTime from "../../res/sprite-arrival-time.png";
import trainLength from "../../res/sprite-train-length.png";
import platformNumber from "../../res/sprite-platform-number.png";
import stopsAt from "../../res/sprite-stops-at.png";
import lineName from "../../res/sprite-line-name.png";
import lineNumber from "../../res/sprite-line-number.png";
import time from "../../res/sprite-time.png";
import text from "../../res/sprite-text.png";
import template from "../../res/sprite-template.png";
import block from "../../res/sprite-block.png";
import borderOn from "../../res/sprite-border-on.png";
import borderOff from "../../res/sprite-border-off.png";
import moveOn from "../../res/sprite-move-on.png";
import moveOff from "../../res/sprite-move-off.png";
import layerShow from "../../res/sprite-layer-show.png";
import layerHide from "../../res/sprite-layer-hide.png";
import layoutHA from "../../res/base_horizontal_a.json";
import layoutHB from "../../res/base_horizontal_b.json";
import layoutHC from "../../res/base_horizontal_c.json";
import layoutVA from "../../res/base_vertical_a.json";
import layoutVSA from "../../res/base_vertical_single_a.json";
import layoutPS from "../../res/base_projector_small.json";
import layoutPM from "../../res/base_projector_medium.json";
import layoutPL from "../../res/base_projector_large.json";

export class AssetData {
    public static registerAssets (assets: AssetController) {
        let sprites: {[key: string]: string} = {
            "destination": destination,
            "arrivalTime": arrivalTime,
            "trainLength": trainLength,
            "platformNumber": platformNumber,
            "stopsAt": stopsAt,
            "lineName": lineName,
            "lineNumber": lineNumber,
            "time": time,
            "text": text,
            "template": template,
            "block": block,

            "borderOn": borderOn,
            "borderOff": borderOff,
            "moveOn": moveOn,
            "moveOff": moveOff,
            "layerShow": layerShow,
            "layerHide": layerHide,
        }

        for (let sprite of Object.keys(sprites)) {
            assets.loadSprite(sprite, sprites[sprite]);
        }

        let layouts: {[key: string]: string} = {
            "ha": JSON.stringify(layoutHA),
            "hb": JSON.stringify(layoutHB),
            "hc": JSON.stringify(layoutHC),
            "va": JSON.stringify(layoutVA),
            "vsa": JSON.stringify(layoutVSA),
            "ps": JSON.stringify(layoutPS),
            "pm": JSON.stringify(layoutPM),
            "pl": JSON.stringify(layoutPL)
        }

        for (let layout of Object.keys(layouts)) {
            assets.loadLiteral("layout" + layout.toUpperCase(), layouts[layout]);
        }
    }
}