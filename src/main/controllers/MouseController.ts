import { PIDSEditor } from "../PIDSEditor";

export class MouseController {
    public x: number = 0;
    public y: number = 0;
    public startX: number = 0;
    public startY: number = 0;

    constructor (editor: PIDSEditor) {
        document.addEventListener("mousemove", (e) => {
            this.x = e.clientX;
            this.y = e.clientY;
            if (!editor.edit.moving.pan) {
                this.x -= editor.edit.offsetX;
                this.y -= editor.edit.offsetY;
            }
            editor.mousemove(this.x, this.y, this.startX, this.startY);
        });

        editor.canvas.addEventListener("mousedown", (e) => {
            this.startX = this.x;
            this.startY = this.y;
            if (e.button == 2) {
                this.startX += editor.edit.offsetX;
                this.startY += editor.edit.offsetY;
            }
            editor.mousedown(this.x, this.y, e);
        });

        document.addEventListener("mouseup", (e) => {
            editor.mouseup(this.x, this.y, this.startX, this.startY);
        });
    }
}