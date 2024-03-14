import { version } from "../version";
import { ArrivalController } from "./controllers/ArrivalController";
import { AssetController } from "./controllers/AssetController";
import { EditorController } from "./controllers/EditorController";
import { LayoutController } from "./controllers/LayoutController";
import { ModuleController } from "./controllers/ModuleController";
import { MouseController } from "./controllers/MouseController";
import { ArrivalTimeModule } from "./modules/module/ArrivalTimeModule";
import { DestinationModule } from "./modules/module/DestinationModule";
import { ModuleData } from "./util/ModuleData";
import { RenderUtil } from "./util/RenderUtil";
import sprites from "../resources/sprites.png";

export class PIDSEditor {
    public mouse: MouseController = new MouseController();
    public arrivals: ArrivalController = new ArrivalController();
    public modules: ModuleController = new ModuleController();
    public layout: LayoutController = new LayoutController(32, 9, 1, window.innerWidth, window.innerHeight);
    public edit: EditorController = new EditorController();
    public assets: AssetController = new AssetController();

    public renderUtil: RenderUtil = new RenderUtil();

    public width: number;
    public height: number;

    public canvas: HTMLCanvasElement;
    public overlay: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public octx: CanvasRenderingContext2D;

    constructor () {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.overlay = document.getElementById("overlay") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.octx = this.overlay.getContext('2d') as CanvasRenderingContext2D;

        this.ctx.textBaseline = "top";
        this.octx.textBaseline = "top"; 

        this.width = this.canvas.width = this.overlay.width = window.innerWidth;
        this.height = this.canvas.height = this.overlay.height = window.innerHeight;

        ModuleData.registerModules(this.modules);
        this.assets.loadImage("sprites", sprites);

        let layouts = {
            "ha": "https://cdn.epicpuppy.dev/assets/pids/base_horizontal_a.json",
            "hb": "https://cdn.epicpuppy.dev/assets/pids/base_horizontal_b.json",
            "hc": "https://cdn.epicpuppy.dev/assets/pids/base_horizontal_c.json",
            "va": "https://cdn.epicpuppy.dev/assets/pids/base_vertical_a.json",
            "ps": "https://cdn.epicpuppy.dev/assets/pids/base_projector_small.json",
            "pm": "https://cdn.epicpuppy.dev/assets/pids/base_projector_medium.json",
            "pl": "https://cdn.epicpuppy.dev/assets/pids/base_projector_large.json"
        }

        for (let layout of Object.keys(layouts)) {
            //@ts-expect-error
            this.assets.loadFile("layout" + layout.toUpperCase(), layouts[layout]);
        }

        this.assets.loadFiles();

        //temporary modules
        let destinationModules = [
            this.modules.createModule("destination", 1.5, 1.5, 22.5, 1.75) as DestinationModule,
            this.modules.createModule("destination", 1.5, 3.625, 22.5, 1.75) as DestinationModule,
            this.modules.createModule("destination", 1.5, 5.75, 22.5, 1.75) as DestinationModule
        ]

        let arrivalModules = [
            this.modules.createModule("arrivalTime", 24.5, 1.5, 6, 1.75) as ArrivalTimeModule,
            this.modules.createModule("arrivalTime", 24.5, 3.625, 6, 1.75) as ArrivalTimeModule,
            this.modules.createModule("arrivalTime", 24.5, 5.75, 6, 1.75) as ArrivalTimeModule
        ]

        destinationModules[1].arrival = 1;
        destinationModules[2].arrival = 2;
        arrivalModules[1].arrival = 1;
        arrivalModules[2].arrival = 2;

        arrivalModules[0].align = "right";
        arrivalModules[1].align = "right";
        arrivalModules[2].align = "right";

        this.edit.selected = destinationModules[0];

        window.setInterval(() => this.render(), 1000 / 60); 
    }

    public render () {
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#ffffff";
        //check arrivals
        this.arrivals.update();
        //draw base pids
        //border
        this.ctx.strokeStyle = "#ffffff";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.layout.x - 1, this.layout.y - 1, this.layout.width * this.layout.pixelSize + 2, this.layout.height * this.layout.pixelSize + 2);
        //gray border
        this.ctx.fillStyle = "#888888";
        this.ctx.fillRect(this.layout.x, this.layout.y, this.layout.width * this.layout.pixelSize, this.layout.height * this.layout.pixelSize);
        //black background
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(this.layout.x + this.layout.borderWidth * this.layout.pixelSize, this.layout.y + this.layout.borderWidth * this.layout.pixelSize, this.layout.width * this.layout.pixelSize - this.layout.borderWidth * 2 * this.layout.pixelSize, this.layout.height * this.layout.pixelSize - this.layout.borderWidth * 2 * this.layout.pixelSize);

        this.modules.render(this.ctx, this);

        //additional information
        this.ctx.fillStyle = "#ffffff";
        this.ctx.textAlign = "left";
        this.ctx.font = "12px monospace";
        //asset loading
        let assetsLoaded = this.assets.getLoaded();
        let assetsTotal = this.assets.getTotal();
        if (assetsLoaded < assetsTotal) {
            this.ctx.fillText("Loading: " + assetsLoaded + "/" + assetsTotal + " - " + this.assets.loading, 5, this.height - 32);
        }
        //version
        this.ctx.fillText(version, 5, this.height - 16);
    }
}