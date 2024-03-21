import { ShortcutController } from "../controllers/ShortcutController";
import { Shortcut } from "./Shortcut";

export class ShortcutData {
    public static registerShortcuts (controller: ShortcutController) {
        controller.register(new Shortcut(
            "closeMenu", ["Escape"], false, false, false,
            (editor) => {
                editor.edit.exportMenu = false;
                document.getElementById("exportMenu")!.style.display = "none";
            }, (e, editor) => editor.edit.exportMenu
        ));

        controller.register(new Shortcut(
            "deselect", ["Escape"], false, false, false,
            (editor) => {
                editor.edit.selected = null;
                document.getElementById("propertyEditor")!.style.display = "none";
            }, (e, editor) => editor.edit.selected !== null
        ));

        controller.register(new Shortcut(
            "delete", ["Delete"], false, false, false,
            (editor) => {
                editor.modules.modules.splice(editor.modules.modules.indexOf(editor.edit.selected!), 1);
                editor.edit.selected = null;
                document.getElementById("propertyEditor")!.style.display = "none";
            }, (e, editor) => editor.edit.selected !== null
        ));

        controller.register(new Shortcut(
            "toggleBorder", ["KeyB"], true, false, false,
            (editor) => {
                editor.layout.showModuleBorders = !editor.layout.showModuleBorders;
                (document.getElementById("borderIcon")! as HTMLImageElement).src = editor.layout.showModuleBorders ? 
                "https://cdn.epicpuppy.dev/assets/pids/sprite-border-on.png" : "https://cdn.epicpuppy.dev/assets/pids/sprite-border-off.png"; 
            }, (e, editor) => true
        ));

        controller.register(new Shortcut(
            "duplicate", ["KeyD"], true, false, false,
            (editor) => {
                if (editor.edit.selected) {
                    let module = editor.edit.selected;
                    let copy = module.duplicate();
                    copy.x += 0.25;
                    copy.y += 0.25;
                    editor.modules.modules.push(copy);
                    editor.edit.selected = copy;
                    editor.edit.showProperties(editor);
                }
            }, (e, editor) => editor.edit.selected !== null
        ));
    }
}