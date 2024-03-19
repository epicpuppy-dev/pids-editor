export interface Layout {
    _editor_size: string, // size of the PIDS (for the editor)
    version: 2, // Layout file format version
    id: string, // ID of the layout
    name?: string, // Display name
    description?: string, // Description
    author?: string, // Author
    modules: {
        typeID: string, // Type of module
        pos: {
            x: number, // Block pixel-scoped x position
            y: number, // Block pixel-scoped y position
            w: number, // Block pixel-scoped width
            h: number // Block pixel-scoped height
        },
        data: { [key: string]: any } // Module-specific data
    }[], // Array of modules in the layout
}