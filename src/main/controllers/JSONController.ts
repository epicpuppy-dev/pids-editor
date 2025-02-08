import { PIDSEditor } from "../PIDSEditor";
import { Module } from "../modules/Module";
import { ArrivalTimeModule } from "../modules/module/ArrivalTimeModule";
import { DestinationModule } from "../modules/module/DestinationModule";
import { PlatformNumberModule } from "../modules/module/PlatformNumberModule";
import { TemplateModule } from "../modules/module/TemplateModule";
import { TimeModule } from "../modules/module/TimeModule";
import { TrainLengthModule } from "../modules/module/TrainLengthModule";

export class JSONController {
    import (raw: string, editor: PIDSEditor) {
        try {
            let json = JSON.parse(raw);
            editor.edit.info = {
                id: "",
                name: "",
                author: "",
                description: ""
            }
            let layout = editor.layout;
            if (json._editor_size) {
                layout.changeType(json._editor_size, editor);
                layout.type = json._editor_size;
            }
            if (json.id) editor.edit.info.id = json.id;
            if (json.name) editor.edit.info.name = json.name;
            if (json.author) editor.edit.info.author = json.author;
            if (json.description) editor.edit.info.description = json.description;
            let modules: Module[] = editor.modules.modules = [];
            editor.edit.selected = null;
            if (json.version == undefined || json.version === 1) {
                //upgrade to version 2
                for (const module of json.modules) {
                    if (module.type == "DestinationModule") modules.push(new DestinationModule(module.pos.x, module.pos.y, module.pos.w, module.pos.h, "Destination"));
                    if (module.type == "ArrivalTimeModule") modules.push(new ArrivalTimeModule(module.pos.x, module.pos.y, module.pos.w, module.pos.h, "Arrival Time"));
                    if (module.type == "TrainLengthModule") modules.push(new TrainLengthModule(module.pos.x, module.pos.y, module.pos.w, module.pos.h, "Train Length"));
                    if (module.type == "PlatformNumberModule") modules.push(new PlatformNumberModule(module.pos.x, module.pos.y, module.pos.w, module.pos.h, "Platform Number"));
                    modules[modules.length - 1].import(module);
                }
                return;
            }
            for (const entry of json.modules) {
                //migrate time module
                if (entry.typeID == "time") {
                    let oldModule = editor.modules.moduleTypes.time.create(entry.pos.x, entry.pos.y, entry.pos.w, entry.pos.h) as TimeModule;
                    oldModule.import(entry.data);
                    let module = editor.modules.moduleTypes.template.create(entry.pos.x, entry.pos.y, entry.pos.w, entry.pos.h) as TemplateModule;
                    module.import(entry.data);
                    let timePrefix = oldModule.loc == "g" ? "$tg" : "$t";
                    for (const key of ["Hours", "Minutes", "Seconds"]) {
                        //@ts-expect-error
                        if (oldModule["show" + key]) {
                            module.baseTemplate = module.baseTemplate.replace("%s", timePrefix + key[0].toLowerCase() + (key == "Hours" ? oldModule.show24Hour ? "4" : "2" : ""));
                        }
                    }

                    if (!oldModule.show24Hour) {
                        module.baseTemplate = module.baseTemplate.replace("%s", "$tap");
                    }

                    editor.modules.modules.push(module);
                    continue;
                }
                let module = editor.modules.moduleTypes[entry.typeID].create(entry.pos.x, entry.pos.y, entry.pos.w, entry.pos.h);
                module.import(entry.data);
                editor.modules.modules.push(module);
            }
        } catch (e: any) {
            alert("{{ui.invalidJSON}}");
            console.error(e);
        }
    }

    export (editor: PIDSEditor) {
        let data: any = {
            _editor_size: editor.layout.type,
            version: 2,
            id: (document.getElementById("exportID")! as HTMLInputElement).value,
            modules: editor.modules.modules.map(m => m.export())
        }
        if (data.id.length === 0) {
            alert("ID cannot be empty");
            return;
        }
    
        let name = (document.getElementById("exportName")! as HTMLInputElement).value;
        if (name.length > 0) {
            data.name = name;
        }
    
        let author = (document.getElementById("exportAuthor")! as HTMLInputElement).value;
        if (author.length > 0) {
            data.author = author;
        }
    
        let description = (document.getElementById("exportDescription")! as HTMLInputElement).value;
        if (description.length > 0) {
            data.description = description;
        }
    
        if (data.id) editor.edit.info.id = data.id;
        if (data.name) editor.edit.info.name = data.name;
        if (data.author) editor.edit.info.author = data.author;
        if (data.description) editor.edit.info.description = data.description;
    
        let blob = new Blob([JSON.stringify(data)], {type: "application/json"});
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = data.id + ".json";
        a.click();
        URL.revokeObjectURL(url);
        editor.edit.menuOpen = false;
    }
}