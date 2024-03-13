export class MouseController {
    public x: number = 0;
    public y: number = 0;

    constructor () {
        document.addEventListener("mousemove", (e) => {
            this.x = e.clientX;
            this.y = e.clientY;
        })
    }
}