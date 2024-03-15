import { PIDSEditor } from "../PIDSEditor";
import { Module } from "../modules/Module";

export class EditorController {
    public selected: Module | null = null;

    public mousedown (x: number, y: number, editor: PIDSEditor) {

    }

    public mouseup (x: number, y: number, startX: number, startY: number, editor: PIDSEditor) {
        //only select module if mouse didn't move more than 5 pixels
        if (Math.abs(x - startX) < 5 && Math.abs(y - startY) < 5) {
            let modules = editor.modules.modules;
            for (let i = modules.length - 1; i >= 0; i--) {
                let module = modules[i];
                let scaledX = module.x * editor.layout.pixelSize + editor.layout.x;
                let scaledY = module.y * editor.layout.pixelSize + editor.layout.y;
                let scaledWidth = module.width * editor.layout.pixelSize;
                let scaledHeight = module.height * editor.layout.pixelSize;
                if (editor.util.pointInBox(x, y, scaledX, scaledY, scaledWidth, scaledHeight)) {
                    this.selected = module;
                    return;
                }
            }
            this.selected = null;
        }
    }
}