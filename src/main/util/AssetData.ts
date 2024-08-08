import { AssetController } from "../controllers/AssetController";

export class AssetData {
    public static registerAssets (assets: AssetController) {
        let sprites: {[key: string]: string} = {
            "destination": "https://cdn.epicpuppy.dev/assets/pids/sprite-destination.png",
            "arrivalTime": "https://cdn.epicpuppy.dev/assets/pids/sprite-arrival-time.png",
            "trainLength": "https://cdn.epicpuppy.dev/assets/pids/sprite-train-length.png",
            "platformNumber": "https://cdn.epicpuppy.dev/assets/pids/sprite-platform-number.png",
            "stopsAt": "https://cdn.epicpuppy.dev/assets/pids/sprite-stops-at.png",
            "lineName": "https://cdn.epicpuppy.dev/assets/pids/sprite-line-name.png",
            "lineNumber": "https://cdn.epicpuppy.dev/assets/pids/sprite-line-number.png",
            "time": "https://cdn.epicpuppy.dev/assets/pids/sprite-time.png",
            "text": "https://cdn.epicpuppy.dev/assets/pids/sprite-text.png",
            "template": "https://cdn.epicpuppy.dev/assets/pids/sprite-template.png",
            "block": "https://cdn.epicpuppy.dev/assets/pids/sprite-block.png",

            "import": "https://cdn.epicpuppy.dev/assets/pids/sprite-import.png",
            "export": "https://cdn.epicpuppy.dev/assets/pids/sprite-export.png",
            "borderOn": "https://cdn.epicpuppy.dev/assets/pids/sprite-border-on.png",
            "borderOff": "https://cdn.epicpuppy.dev/assets/pids/sprite-border-off.png",
            "moveOn": "https://cdn.epicpuppy.dev/assets/pids/sprite-move-on.png",
            "moveOff": "https://cdn.epicpuppy.dev/assets/pids/sprite-move-off.png",
            "new": "https://cdn.epicpuppy.dev/assets/pids/sprite-new.png",

            "alignLeft": "https://cdn.epicpuppy.dev/assets/pids/sprite-align-left.png",
            "alignCenter": "https://cdn.epicpuppy.dev/assets/pids/sprite-align-center.png",
            "alignRight": "https://cdn.epicpuppy.dev/assets/pids/sprite-align-right.png",
        }

        for (let sprite of Object.keys(sprites)) {
            assets.loadSprite(sprite, sprites[sprite]);
        }

        let layouts: {[key: string]: string} = {
            "ha": "https://cdn.epicpuppy.dev/assets/pids/base_horizontal_a.json",
            "hb": "https://cdn.epicpuppy.dev/assets/pids/base_horizontal_b.json",
            "hc": "https://cdn.epicpuppy.dev/assets/pids/base_horizontal_c.json",
            "va": "https://cdn.epicpuppy.dev/assets/pids/base_vertical_a.json",
            "vsa": "https://cdn.epicpuppy.dev/assets/pids/base_vertical_single_a.json",
            "ps": "https://cdn.epicpuppy.dev/assets/pids/base_projector_small.json",
            "pm": "https://cdn.epicpuppy.dev/assets/pids/base_projector_medium.json",
            "pl": "https://cdn.epicpuppy.dev/assets/pids/base_projector_large.json"
        }

        for (let layout of Object.keys(layouts)) {
            assets.loadFile("layout" + layout.toUpperCase(), layouts[layout]);
        }
    }
}