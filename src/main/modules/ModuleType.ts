import { AtlasLocation } from "../util/AtlasLocation";
import { Module } from "./Module";

export class ModuleType {
    public id: string;
    public name: string;
    public create: (x: number, y: number, width: number, height: number) => Module;
    public sprite: AtlasLocation;

    constructor (id: string, name: string, create: (x: number, y: number, width: number, height: number) => Module, sprite: AtlasLocation) {
        this.id = id;
        this.name = name;
        this.create = create;
        this.sprite = sprite;
    }
}