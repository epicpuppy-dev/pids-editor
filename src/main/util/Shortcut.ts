import { PIDSEditor } from "../PIDSEditor";

export class Shortcut {
    public id: string;
    public key: string[];
    public ctrl: boolean;
    public shift: boolean;
    public alt: boolean;
    public action: (editor: PIDSEditor) => void;
    public active: (e: KeyboardEvent, editor: PIDSEditor) => boolean;

    constructor (id: string, key: string[], ctrl: boolean, shift: boolean, alt: boolean, action: (editor: PIDSEditor) => void, active: (e: KeyboardEvent, editor: PIDSEditor) => boolean) {
        this.id = id;
        this.key = key;
        this.ctrl = ctrl;
        this.shift = shift;
        this.alt = alt;
        this.action = action;
        this.active = active;
    }
}