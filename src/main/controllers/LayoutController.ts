import { PIDSEditor } from "../PIDSEditor";

export class LayoutController {
    public type: string = "hb";
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public borderWidth: number;
    public pixelSize: number = 24;
    public showModuleBorders: boolean = true;
    public types = {
        ha: {
            width: 32,
            height: 11,
            edge: 0.5,
            pixel: 24
        },
        hb: {
            width: 32,
            height: 9,
            edge: 1,
            pixel: 24
        },
        hc: {
            width: 32,
            height: 10,
            edge: 0.75,
            pixel: 24
        },
        va: {
            width: 16,
            height: 32,
            edge: 1,
            pixel: 24
        },
        ps: {
            width: 16,
            height: 16,
            edge: 0,
            pixel: 24
        },
        pm: {
            width: 48,
            height: 32,
            edge: 0,
            pixel: 24
        },
        pl: {
            width: 48,
            height: 48,
            edge: 0,
            pixel: 24
        }
    }
    
    constructor (pxWidth: number, pxHeight: number, pxBorderWidth: number, totalWidth: number, totalHeight: number) {
        this.width = pxWidth;
        this.height = pxHeight;
        this.borderWidth = pxBorderWidth;
        let width = pxWidth * this.pixelSize;
        let height = pxHeight * this.pixelSize;
        this.x = Math.floor((totalWidth - width) / 2);
        this.y = Math.floor((totalHeight - height) / 2);
    }

    public reposition (w: number, h: number, bw: number, editor: PIDSEditor) {
        this.width = w;
        this.height = h;
        this.borderWidth = bw;
        let width = w * this.pixelSize;
        let height = h * this.pixelSize;
        this.x = Math.floor((editor.width - width) / 2);
        this.y = Math.floor((editor.height - height) / 2);
    }

    public changeType (type: string, editor: PIDSEditor) {
        if (!(type in this.types)) return;
        this.type = type;
        //@ts-expect-error
        this.pixelSize = this.types[type].pixel;
        //@ts-expect-error
        this.reposition(this.types[type].width, this.types[type].height, this.types[type].edge, editor);
    }
}