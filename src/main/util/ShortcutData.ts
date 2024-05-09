import { ShortcutController } from "../controllers/ShortcutController";
import { Shortcut } from "./Shortcut";

export class ShortcutData {
    public static registerShortcuts (controller: ShortcutController) {
        controller.register(new Shortcut(
            "deselect", ["Escape"], false, false, false,
            (editor) => {
                if (editor.edit.menuOpen) return;
                editor.edit.selected = null;
                document.getElementById("propertyEditor")!.style.display = "none";
            }, (e, editor) => editor.edit.selected !== null
        ));

        controller.register(new Shortcut(
            "closeMenu", ["Escape"], false, false, false,
            (editor) => {
                editor.edit.menuOpen = false;
                document.getElementById("exportMenu")!.style.display = "none";
                document.getElementById("newMenu")!.style.display = "none";
                document.getElementById("colorMenu")!.style.display = "none";
                document.getElementById("settingsMenu")!.style.display = "none";
            }, (e, editor) => editor.edit.menuOpen
        ));

        controller.register(new Shortcut(
            "delete", ["Delete"], false, false, false,
            (editor) => {
                editor.modules.modules.splice(editor.modules.modules.indexOf(editor.edit.selected!), 1);
                editor.edit.selected = null;
                document.getElementById("propertyEditor")!.style.display = "none";
                editor.edit.checkCollisions(editor);
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
                    editor.edit.checkCollisions(editor);
                }
            }, (e, editor) => editor.edit.selected !== null
        ));

        controller.register(new Shortcut(
            "nextLayer", ["KeyE"], false, false, true,
            (editor) => {
                editor.edit.changeLayer(editor.edit.editingLayer + 1);
            }, (e, editor) => !editor.edit.menuOpen
        ));

        controller.register(new Shortcut(
            "prevLayer", ["KeyQ"], false, false, true,
            (editor) => {
                editor.edit.changeLayer(editor.edit.editingLayer - 1);
            }, (e, editor) => !editor.edit.menuOpen
        ));

        controller.register(new Shortcut(
            "moveNextLayer", ["KeyE"], false, true, true,
            (editor) => {
                let selected = editor.edit.selected;
                editor.edit.changeLayer(editor.edit.editingLayer + 1);
                if (selected) {
                    selected.layer = editor.edit.editingLayer;
                    editor.edit.selected = selected;
                    editor.edit.showProperties(editor);
                }
            }, (e, editor) => editor.edit.selected !== null && !editor.edit.menuOpen
        ));

        controller.register(new Shortcut(
            "movePrevLayer", ["KeyQ"], false, true, true,
            (editor) => {
                let selected = editor.edit.selected;
                editor.edit.changeLayer(editor.edit.editingLayer - 1);
                if (selected) {
                    selected.layer = editor.edit.editingLayer;
                    editor.edit.selected = selected;
                    editor.edit.showProperties(editor);
                }
            }, (e, editor) => editor.edit.selected !== null && !editor.edit.menuOpen
        ));
    }
}   