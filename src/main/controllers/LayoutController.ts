export class LayoutController {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public borderWidth: number;
    public pixelSize: number = 24;
    public showModuleBorders: boolean = true;
    
    constructor (pxWidth: number, pxHeight: number, pxBorderWidth: number, totalWidth: number, totalHeight: number) {
        this.width = pxWidth;
        this.height = pxHeight;
        this.borderWidth = pxBorderWidth;
        let width = pxWidth * this.pixelSize;
        let height = pxHeight * this.pixelSize;
        this.x = Math.floor((totalWidth - width) / 2);
        this.y = Math.floor((totalHeight - height) / 2);
    }
}