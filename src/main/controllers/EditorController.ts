import { PIDSEditor } from "../PIDSEditor";
import { Module } from "../modules/Module";

export class EditorController {
    public selected: Module | null = null;
    public offsetX = 0;
    public offsetY = 0;
    public moving: {[key in "l" | "r" | "t" | "b" | "a"]: boolean} = {
        l: false,
        r: false,
        t: false,
        b: false,
        a: false,
    };
    private start: {[key in "x" | "y" | "w" | "h"]: number} = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
    };

    public mousedown (x: number, y: number, editor: PIDSEditor) {
        if (this.selected) {
            let scaledX = this.selected.x * editor.layout.pixelSize + editor.layout.x;
            let scaledY = this.selected.y * editor.layout.pixelSize + editor.layout.y;
            let scaledWidth = this.selected.width * editor.layout.pixelSize;
            let scaledHeight = this.selected.height * editor.layout.pixelSize;
            let left = scaledX;
            let right = scaledX + scaledWidth;
            let top = scaledY;
            let bottom = scaledY + scaledHeight;
            if (
                //top left
                editor.util.pointInBox(x, y, left - 5, top - 5, 10, 10) ||
                //left
                editor.util.pointInBox(x, y, left - 5, top + scaledHeight / 2 - 5, 10, 10) ||
                //bottom left  
                editor.util.pointInBox(x, y, left - 5, bottom - 5, 10, 10)
            ) {
                this.moving.l = true;
            } 

            if (
                //top right
                editor.util.pointInBox(x, y, right - 5, top - 5, 10, 10) ||
                //right
                editor.util.pointInBox(x, y, right - 5, top + scaledHeight / 2 - 5, 10, 10) ||
                //bottom right
                editor.util.pointInBox(x, y, right - 5, bottom - 5, 10, 10)
            ) {
                this.moving.r = true;
            } 

            if (
                //top left
                editor.util.pointInBox(x, y, left - 5, top - 5, 10, 10) ||
                //top
                editor.util.pointInBox(x, y, left + scaledWidth / 2 - 5, top - 5, 10, 10) ||
                //top right
                editor.util.pointInBox(x, y, right - 5, top - 5, 10, 10)    
            ) {
                this.moving.t = true;
            } 

            if (
                //bottom left
                editor.util.pointInBox(x, y, left - 5, bottom - 5, 10, 10) ||
                //bottom
                editor.util.pointInBox(x, y, left + scaledWidth / 2 - 5, bottom - 5, 10, 10) ||
                //bottom right
                editor.util.pointInBox(x, y, right - 5, bottom - 5, 10, 10)    
            ) {
                this.moving.b = true;
            }

            if (
                editor.util.pointInBox(x, y, left, top, scaledWidth, scaledHeight) &&
                !this.moving.l && !this.moving.r && !this.moving.t && !this.moving.b
            ) {
                this.moving.a = true;
            }
            this.start.x = this.selected.x;
            this.start.y = this.selected.y;
            this.start.w = this.selected.width;
            this.start.h = this.selected.height;
        }
    }

    public mousemove (x: number, y: number, startX: number, startY: number, editor: PIDSEditor) {
        if (this.selected) {
            let xMoveConstant = Math.round((x - startX) / editor.layout.pixelSize * 8) / 8;
            let yMoveConstant = Math.round((y - startY) / editor.layout.pixelSize * 8) / 8;
            if (this.moving.t) {
                this.selected.y = this.start.y + yMoveConstant;
                this.selected.height = this.start.h - yMoveConstant;
            }
            if (this.moving.b) {
                this.selected.height = this.start.h + yMoveConstant;
            }
            if (this.moving.l) {
                this.selected.x = this.start.x + xMoveConstant;
                this.selected.width = this.start.w - xMoveConstant;
            }
            if (this.moving.r) {
                this.selected.width = this.start.w + xMoveConstant;
            }
            if (this.moving.a) {
                this.selected.x = this.start.x + xMoveConstant;
                this.selected.y = this.start.y + yMoveConstant;
            }

            //set position
            document.getElementById("posX")!.innerText = this.selected.x.toFixed(3);
            document.getElementById("posY")!.innerText = this.selected.y.toFixed(3);
            document.getElementById("posW")!.innerText = this.selected.width.toFixed(3);
            document.getElementById("posH")!.innerText = this.selected.height.toFixed(3);
        }
    }

    public mouseup (x: number, y: number, startX: number, startY: number, editor: PIDSEditor) {
        //stop moving
        this.moving.l = false;
        this.moving.r = false;
        this.moving.t = false;
        this.moving.b = false;
        this.moving.a = false;
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
                    this.showProperties(editor);
                    return;
                }
            }
            this.selected = null;
            document.getElementById("propertyEditor")!.style.display = "none";
        }
    }

    public showProperties (editor: PIDSEditor) {
        if (!this.selected) return;
        //show menu
        document.getElementById("propertyEditor")!.style.display = "flex";
        
        //set name
        document.getElementById("moduleName")!.innerText = this.selected.name + " Module";

        //set position
        document.getElementById("posX")!.innerText = this.selected.x.toFixed(3);
        document.getElementById("posY")!.innerText = this.selected.y.toFixed(3);
        document.getElementById("posW")!.innerText = this.selected.width.toFixed(3);
        document.getElementById("posH")!.innerText = this.selected.height.toFixed(3);

        //get properties
        let properties = this.selected.getProperties();

        //loop through properties
        for (let property of document.getElementsByClassName("property")) {
            let element = property as HTMLElement;
            let input = document.getElementById(element.id.replace("Container", "Input"))! as HTMLInputElement;
            if (element.id.replace("Container", "") in properties) {
                element.style.display = "table-row";
                //overrides
                if (element.id == "alignContainer") {
                    if (!("align" in this.selected)) return;
                    let left = document.getElementById("alignLeft")!;
                    let center = document.getElementById("alignCenter")!;
                    let right = document.getElementById("alignRight")!;
                    left.style.backgroundColor = this.selected.align == "left" ? "#666666ff" : "#00000000";
                    center.style.backgroundColor = this.selected.align == "center" ? "#666666ff" : "#00000000";
                    right.style.backgroundColor = this.selected.align == "right" ? "#666666ff" : "#00000000";
                    left.onclick = () => {
                        if ("align" in properties) properties.align[0]("left", editor);
                        this.showProperties(editor);
                    }
                    center.onclick = () => {
                        if ("align" in properties) properties.align[0]("center", editor);
                        this.showProperties(editor);
                    }
                    right.onclick = () => {
                        if ("align" in properties) properties.align[0]("right", editor);
                        this.showProperties(editor);
                    }
                    continue;
                }
                input.value = properties[element.id.replace("Container", "")][1];
                input.oninput = (e) => {
                    let value = input.value;
                    console.log(value);
                    properties[element.id.replace("Container", "")][0](value, editor);
                    console.log(this.selected);
                }
            } else {
                element.style.display = "none";
            }
        }
    }
}