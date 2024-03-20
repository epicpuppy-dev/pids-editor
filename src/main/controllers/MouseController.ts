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
            editor.mousemove(this.x, this.y, this.startX, this.startY);
        });

        editor.canvas.addEventListener("mousedown", (e) => {
            this.startX = this.x;
            this.startY = this.y;
            editor.mousedown(this.x, this.y, e);
        });

        document.addEventListener("mouseup", (e) => {
            editor.mouseup(this.x, this.y, this.startX, this.startY);
        });
    }
}