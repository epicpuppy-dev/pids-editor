import { PIDSEditor } from "../PIDSEditor";
import { Shortcut } from "../util/Shortcut";
import { AssetController } from "./AssetController";

export class ShortcutController {
    public assets: AssetController;
    private shortcuts: {[key: string]: Shortcut} = {};

    constructor (editor: PIDSEditor) {
        this.assets = editor.assets;
        
        window.addEventListener("keydown", (e) => {
            //special move logic
            if (/Arrow(Left|Right|Up|Down)/.test(e.code) && !editor.edit.menuOpen && editor.edit.arrowKeyMove) {
                e.preventDefault();
                if (editor.edit.selected) {
                    let module = editor.edit.selected;
                    let tl = e.ctrlKey;
                    let br = e.altKey;
                    let amount = e.shiftKey ? 0.5 : 0.125;
                    let dx = e.code == "ArrowLeft" ? -amount : e.code == "ArrowRight" ? amount : 0;
                    let dy = e.code == "ArrowUp" ? -amount : e.code == "ArrowDown" ? amount : 0;
                    if (tl) {
                        module.x += dx;
                        module.y += dy;
                        module.width -= dx;
                        module.height -= dy;
                    } else if (br) {
                        module.width += dx;
                        module.height += dy;
                    } else {
                        module.x += dx;
                        module.y += dy;
                    }
                    editor.edit.showProperties(editor);
                    editor.edit.checkCollisions(editor);
                }
            }

            for (let id in this.shortcuts) {
                let shortcut = this.shortcuts[id];
                // check key and modifiers
                if (!shortcut.key.includes(e.code) || e.ctrlKey != shortcut.ctrl || e.shiftKey != shortcut.shift || e.altKey != shortcut.alt) {
                    continue;
                }
                console.log(e.ctrlKey, e.shiftKey, e.altKey, e.code);

                // check if active
                if (shortcut.active(e, editor)) {
                    shortcut.action(editor);
                    e.preventDefault();
                }
            }
        });
    }

    public register (shortcut: Shortcut) {
        this.shortcuts[shortcut.id] = shortcut;
    }
}