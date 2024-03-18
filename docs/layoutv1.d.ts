export interface Layout {
    version: 1, // Layout file format version
    id: string, // ID of the layout
    name?: string, // Display name
    description?: string, // Description
    author?: string, // Author
    modules: AnyModule[], // Array of modules in the layout
}

export type AnyModule = DestinationModule | ArrivalTimeModule | TrainLengthModule | PlatformNumberModule; // Accepted module types

export interface Module {
    type: string, // Type of module
    pos: {
        x: number, // Block pixel-scoped x position
        y: number, // Block pixel-scoped y position
        w: number, // Block pixel-scoped width
        h: number // Block pixel-scoped height
    }
}

export interface TextModule extends Module {
    align?: "left" | "right" | "center", // Text alignment
    color?: number, // Text color (decimal)
    arrival?: number // Arrival number
}

export interface DestinationModule extends TextModule {
    type: "DestinationModule",
}

export interface ArrivalTimeModule extends TextModule {
    type: "ArrivalTimeModule",
}

export interface TrainLengthModule extends Module {
    type: "TrainLengthModule"
}

export interface PlatformNumberModule extends Module {
    type: "PlatformNumberModule"
}