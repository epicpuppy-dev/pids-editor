import { Module } from "../modules/Module";
import { ModuleType } from "../modules/ModuleType"
import { PIDSEditor } from "../PIDSEditor";

export class ModuleController {
    public modules: Module[] = [];
    public moduleTypes: {[key: string]: ModuleType} = {};

    public registerModuleType (moduleType: ModuleType, editor: PIDSEditor) {
        if (this.moduleTypes[moduleType.id]) {
            throw new Error("module id \"" + moduleType.id + "\" is registered twice");
        }
        this.moduleTypes[moduleType.id] = moduleType;

        //create button

        let button = moduleType.sprite.img;
        document.getElementById("moduleTypes")!.appendChild(button);
        button.width = 32;
        button.height = 32;
        button.classList.add("moduleIcon");
        button.title = moduleType.name;
        button.onclick = () => {
            editor.edit.placing = moduleType;
            editor.edit.selected = null;
            document.getElementById("propertyEditor")!.style.display = "none";
        }
    }

    public render (ctx: CanvasRenderingContext2D, editor: PIDSEditor) {
        //guidelines
        if (editor.edit.selected) {
            ctx.fillStyle = "#ff00ff";
            let scaledX = editor.edit.selected.x * editor.layout.pixelSize + editor.layout.x;
            let scaledY = editor.edit.selected.y * editor.layout.pixelSize + editor.layout.y;
            let scaledWidth = editor.edit.selected.width * editor.layout.pixelSize;
            let scaledHeight = editor.edit.selected.height * editor.layout.pixelSize;
            if (editor.edit.moving.l || editor.edit.moving.a) {
                ctx.fillRect(scaledX, -editor.edit.offsetY, 1, editor.height);
            }
            if (editor.edit.moving.r || editor.edit.moving.a) {
                ctx.fillRect(scaledX + scaledWidth - 1, -editor.edit.offsetY, 1, editor.height);
            }
            if (editor.edit.moving.t || editor.edit.moving.a) {
                ctx.fillRect(-editor.edit.offsetX, scaledY, editor.width, 1);
            }
            if (editor.edit.moving.b || editor.edit.moving.a) {
                ctx.fillRect(-editor.edit.offsetX, scaledY + scaledHeight - 1, editor.width, 1);
            }
        }
        for (let module of this.modules) {
            module.render(ctx, editor);
        }
    }

    public createModule (type: string, x: number, y: number, width: number, height: number) {
        if (!Object.keys(this.moduleTypes).includes(type)) {
            throw new Error("module id \"" + type + "\" does not exist");
        }
        let module = this.moduleTypes[type].create(x, y, width, height)
        this.modules.push(module);
        return module;
    }
}