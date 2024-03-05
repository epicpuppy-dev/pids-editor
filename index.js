const canvas = document.getElementById('canvas');
const overlay = document.getElementById('overlay');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
/** @type {CanvasRenderingContext2D} */
const octx = overlay.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
overlay.width = width;
overlay.height = height;
const image = new Image();
image.src = "sprites.png";

const VERSION = "0.2.0";

/*
Some scale stuff
1 block = 16 in-game pixels
1 in-game pixel = PIXEL_SIZE screen pixels
*/

ctx.fillStyle = "black";
ctx.fillRect(0, 0, width, height);
ctx.fillStyle = "#ffffff";
ctx.textBaseline = "top";

let pidsWidth = 32;
let pidsHeight = 11;

let pixelSize = 24;
let borderWidth = 2;
let edgeWidth = 0.5;
let pids = {
    width: pidsWidth * pixelSize,
    height: pidsHeight * pixelSize,
    x: Math.floor(width / 2 - pidsWidth * pixelSize / 2),
    y: Math.floor(height / 2 - pidsHeight * pixelSize / 2)
}

let size = "ha";

const mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    pan: false,
    place: null
}
const move = {
    moveT: false,
    moveB: false,
    moveL: false,
    moveR: false,
    moveA: false,
    placing: false,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0
}

const sizes = {
    ha: {
        width: 32,
        height: 11,
        edge: 0.5,
        pixel: 24,
        file: "base_horizontal_a.json"
    },
    hb: {
        width: 32,
        height: 9,
        edge: 1,
        pixel: 24,
        file: "base_horizontal_b.json"
    },
    hc: {
        width: 32,
        height: 10,
        edge: 0.75,
        pixel: 24,
        file: "base_horizontal_c.json"
    },
    va: {
        width: 16,
        height: 32,
        edge: 1,
        pixel: 24,
        file: "base_vertical_a.json"
    },
    ps: {
        width: 16,
        height: 16,
        edge: 0,
        pixel: 24,
        file: "base_projector_small.json"
    },
    pm: {
        width: 48,
        height: 32,
        edge: 0,
        pixel: 24,
        file: "base_projector_medium.json"
    },
    pl: {
        width: 48,
        height: 48,
        edge: 0,
        pixel: 24,
        file: "base_projector_large.json"
    }
}

async function loadDefaults () {
    try {
        for (const size of Object.keys(sizes)) {
            if (!sizes[size].file) continue;
            const response = await fetch(`default/${sizes[size].file}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            sizes[size].default = data;
        }
        loadJSON(sizes.ha.default);
    } catch (e) {
        alert(e);
    }
}

loadDefaults();

let buttons = {
    //module placement
    destination: {
        x: 5,
        y: 5,
        width: 32,
        height: 32
    },
    arrivalTime: {
        x: 45,
        y: 5,
        width: 32,
        height: 32
    },
    trainLength: {
        x: 85,
        y: 5,
        width: 32,
        height: 32
    },
    platformNumber: {
        x: 125,
        y: 5,
        width: 32,
        height: 32
    },
    stopsAt: {
        x: 165,
        y: 5,
        width: 32,
        height: 32
    },
    //management
    export: {
        x: width - 37,
        y: 5,
        width: 32,
        height: 32
    },
    import: {
        x: width - 77,
        y: 5,
        width: 32,
        height: 32
    },
    border: {
        x: width - 117,
        y: 5,
        width: 32,
        height: 32
    },
    new: {
        x: width - 157,
        y: 5,
        width: 32,
        height: 32,
    },
    //properties
    align: {
        left: {
            x: width - 200,
            y: 80,
            width: 30,
            height: 30
        },
        center: {
            x: width - 160,
            y: 80,
            width: 30,
            height: 30
        },
        right: {
            x: width - 120,
            y: 80,
            width: 30,
            height: 30
        }
    },
    arrival: {
        plus: {
            x: width - 130,
            y: 104,
            width: 19,
            height: 19
        },
        plusPlus: {
            x: width - 106,
            y: 104,
            width: 19,
            height: 19
        },
        minus: {
            x: width - 180,
            y: 104,
            width: 19,
            height: 19
        },
        minusMinus: {
            x: width - 206,
            y: 104,
            width: 19,
            height: 19
        }
    },
    color: {
        x: width - 200,
        y: 104,
        width: 110,
        height: 16
    }
}
let drawBorder = true;
let selected = -1;
let offsetX = 0;
let offsetY = 0;
let exportMenu = false;
let info = {
    id: "base_horizontal_a",
    name: "Base Horizontal Type A",
    author: "EpicPuppy613",
    description: "MTR Built-in layout.\n\nSize: 32 x 11\nArrivals: 1"
}
class Module {
    constructor (name, x, y, width, height) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    render (text, align, color, selected) {
        let textMaxWidth = this.width - pixelSize * 0.5;
        let textMaxHeight = this.height - pixelSize * 0;
        let textX = this.x + pixelSize * 0.25;
        ctx.textAlign = align;
        ctx.fillStyle = color;
        textX = Math.floor(textX);
        if (align === "center") textX = Math.floor(this.x + this.width / 2);
        else if (align === "right") textX = Math.floor(this.x + this.width - pixelSize * 0.25);
        ctx.font = Math.floor(textMaxHeight) + "px 'Minecraft',Consolas,'Courier New',monospace";
        ctx.save();
        ctx.translate(textX + offsetX, this.y + offsetY);
        if (ctx.measureText(text).width > textMaxWidth) {
            ctx.scale(textMaxWidth / ctx.measureText(text).width, 1);
        }
        ctx.fillText(text, 0, 0);
        ctx.restore();
        if (drawBorder && !selected) drawModuleBorder(this.name, this.x + offsetX, this.y + offsetY, this.width, this.height, 1, "#ffffff");
        else if (drawBorder && selected) {
            drawModuleBorder(this.name, this.x + offsetX, this.y + offsetY, this.width, this.height, 1, "#ffa500");
            ctx.beginPath();
            //TL
            ctx.rect(this.x - 3 + offsetX, this.y - 3 + offsetY, 7, 7);
            //T
            ctx.rect(Math.round(this.x + this.width / 2) - 3 + offsetX, this.y - 3 + offsetY, 7, 7);
            //TR
            ctx.rect(this.x - 4 + this.width + offsetX, this.y - 3 + offsetY, 7, 7);
            //L
            ctx.rect(this.x - 3 + offsetX, Math.round(this.y + this.height / 2) - 3 + offsetY, 7, 7);
            //R
            ctx.rect(this.x - 4 + this.width + offsetX, Math.round(this.y + this.height / 2) - 3 + offsetY, 7, 7);
            //BL
            ctx.rect(this.x - 3 + offsetX, this.y - 4 + this.height + offsetY, 7, 7);
            //B
            ctx.rect(Math.round(this.x + this.width / 2) - 3 + offsetX, this.y - 4 + this.height + offsetY, 7, 7);
            //BR
            ctx.rect(this.x - 4 + this.width + offsetX, this.y - 4 + this.height + offsetY, 7, 7);
            ctx.fillStyle = "#ffa500";
            ctx.fill();
        }
    }

    export () {
        return {
            type: this.name,
            pos: {
                x: (this.x - pids.x) / pixelSize,
                y: (this.y - pids.y) / pixelSize,
                w: this.width / pixelSize,
                h: this.height / pixelSize
            }
        }
    }

    duplicate () {
        return new Module(this.name, this.x, this.y, this.width, this.height);
    }
}

class DestinationModule extends Module {
    /**
     * 
     * @param {{align?: "left"|"right"|"center", color: string, arrival: number}} options 
     */
    constructor (x, y, width, height, options) {
        super("DestinationModule", x, y, width, height);
        this.options = options;
        if (options.arrival) {
            this.arrival = options.arrival;
        } else {
            this.arrival = 0;
        }
    }

    render (selected) {
        if (!trains[this.arrival]) {
            super.render("", "left", "#ffffff", selected);
            return;
        };
        let destination = trains[this.arrival].destination;
        let align = "left";
        let color = "#ffffff";
        if (this.options) {
            switch (this.options.align) {
                case "right":
                    align = "right";
                    break;
                case "center":
                    align = "center";
                    break;
            }
            if (this.options.color) {
                color = this.options.color;
            }
        }
        super.render(destination, align, color, selected);
    }

    export () {
        return {
            type: "DestinationModule",
            pos: {
                x: (this.x - pids.x) / pixelSize,
                y: (this.y - pids.y) / pixelSize,
                w: this.width / pixelSize,
                h: this.height / pixelSize
            },
            align: this.options.align,
            color: parseInt(this.options.color.slice(1), 16),
            arrival: this.arrival
        }
    }

    import (data) {
        if (data.align) this.options.align = data.align;
        if (data.color) this.options.color = "#" + data.color.toString(16);
        if (data.arrival) this.arrival = data.arrival, this.options.arrival = data.arrival;
    }

    duplicate () {
        return new DestinationModule(this.x, this.y, this.width, this.height, structuredClone(this.options));
    }
}

class ArrivalTimeModule extends Module {
    /**
     * 
     * @param {{align?: "left"|"right"|"center", color: string, arrival: number}} options 
     */
    constructor (x, y, width, height, options) {
        super("ArrivalTimeModule", x, y, width, height);
        this.options = options;
        if (options.arrival) {
            this.arrival = options.arrival;
        } else {
            this.arrival = 0;
        }
    }

    render (selected) {
        if (!trains[this.arrival]) {
            super.render("", "left", "#ffffff", selected);
            return;
        };
        let time = trains[this.arrival].time;
        let relTime = time - Date.now();
        let timeText = relTime <= 1000 ? "" : relTime < 60 * 1000 ? Math.floor(relTime / 1000) + " sec" : Math.floor(relTime / 60000) + " min";
        let align = "left";
        let color = "#ffffff";
        if (this.options) {
            switch (this.options.align) {
                case "right":
                    align = "right";
                    break;
                case "center":
                    align = "center";
                    break;
            }
            if (this.options.color) {
                color = this.options.color;
            }
        }
        super.render(timeText, align, color, selected);
    }

    import (data) {
        if (data.align) this.options.align = data.align;
        if (data.color) this.options.color = "#" + data.color.toString(16);
        if (data.arrival) this.arrival = data.arrival, this.options.arrival = data.arrival;
    }

    export () {
        return {
            type: "ArrivalTimeModule",
            pos: {
                x: (this.x - pids.x) / pixelSize,
                y: (this.y - pids.y) / pixelSize,
                w: this.width / pixelSize,
                h: this.height / pixelSize
            },
            align: this.options.align,
            color: parseInt(this.options.color.slice(1), 16),
            arrival: this.arrival
        }
    }

    duplicate () {
        return new ArrivalTimeModule(this.x, this.y, this.width, this.height, structuredClone(structuredClone(this.options)));
    }
}

class TrainLengthModule extends Module {
    /**
     * 
     * @param {{align?: "left"|"right"|"center", color: string, arrival: number}} options 
     */
    constructor (x, y, width, height, options) {
        super("TrainLengthModule", x, y, width, height);
        this.options = options;
        if (options.arrival) {
            this.arrival = options.arrival;
        } else {
            this.arrival = 0;
        }
    }

    render (selected) {
        if (!trains[this.arrival]) {
            super.render("", "left", "#ffffff", selected);
            return;
        };
        let cars = trains[this.arrival].cars;
        let carText = cars + "-car";
        let align = "left";
        let color = "#ffffff";
        if (this.options) {
            switch (this.options.align) {
                case "right":
                    align = "right";
                    break;
                case "center":
                    align = "center";
                    break;
            }
            if (this.options.color) {
                color = this.options.color;
            }
        }
        super.render(carText, align, color, selected);
    }

    import (data) {
        if (data.align) this.options.align = data.align;
        if (data.color) this.options.color = "#" + data.color.toString(16);
        if (data.arrival) this.arrival = data.arrival, this.options.arrival = data.arrival;
    }

    export () {
        return {
            type: "TrainLengthModule",
            pos: {
                x: (this.x - pids.x) / pixelSize,
                y: (this.y - pids.y) / pixelSize,
                w: this.width / pixelSize,
                h: this.height / pixelSize
            },
            align: this.options.align,
            color: parseInt(this.options.color.slice(1), 16),
            arrival: this.arrival
        }
    }

    duplicate () {
        return new TrainLengthModule(this.x, this.y, this.width, this.height, structuredClone(structuredClone(this.options)));
    }
}

class PlatformNumberModule extends Module {
    /**
     * 
     * @param {{align?: "left"|"right"|"center", color: string, arrival: number}} options 
     */
    constructor (x, y, width, height, options) {
        super("PlatformNumberModule", x, y, width, height);
        this.options = options;
        if (options.arrival) {
            this.arrival = options.arrival;
        } else {
            this.arrival = 0;
        }
    }

    render (selected) {
        if (!trains[this.arrival]) {
            super.render("", "left", "#ffffff", selected);
            return;
        };
        let platform = trains[this.arrival].platform;
        let align = "left";
        let color = "#ffffff";
        if (this.options) {
            switch (this.options.align) {
                case "right":
                    align = "right";
                    break;
                case "center":
                    align = "center";
                    break;
            }
            if (this.options.color) {
                color = this.options.color;
            }
        }
        super.render(platform, align, color, selected);
    }

    import (data) {
        if (data.align) this.options.align = data.align;
        if (data.color) this.options.color = "#" + data.color.toString(16);
        if (data.arrival) this.arrival = data.arrival, this.options.arrival = data.arrival;
    }

    export () {
        return {
            type: "PlatformNumberModule",
            pos: {
                x: (this.x - pids.x) / pixelSize,
                y: (this.y - pids.y) / pixelSize,
                w: this.width / pixelSize,
                h: this.height / pixelSize
            },
            align: this.options.align,
            color: parseInt(this.options.color.slice(1), 16),
            arrival: this.arrival
        }
    }

    duplicate () {
        return new PlatformNumberModule(this.x, this.y, this.width, this.height, structuredClone(structuredClone(this.options)));
    }
}

let modules = [];

/** @type {{destination: string, time: number, platform: string, delay: number, lineColor: string, stops: string[], cars: number}[]} */
let trains = [];

const stations = [
    "Desert Grand Central",
    "Reston Intermodal",
    "Northview Central",
    "Fairview Docks",
    "Fairview Junction",
    "Temple of Time",
    "Lake City",
    "Chong Shu Chau",
    "Spawn",
    "Cyan Heights",
    "Inage Kaigan",
    "Hobb's End",
    "Market Quarter",
    "New Victoria",
    "Rosewood",
    "Llanmara Saint Ann's",
    "Yunlong",
    "Sakuradori",
    "Bethel Road",
    "Minami Yunlong"
];

let time = Date.now();

//generate random trains
for (let i = 0; i < 50; i++) {
    generateTrain();
}

function generateTrain () {
    let stops = [];
    time += Math.floor((Math.random() + 0.5) * 120 * 1000);
    let trainTime = time;
    for (let j = 0; j < Math.floor(Math.random() * 5) + 2; j++) {
        trainTime += Math.floor((Math.random() + 0.25) * 120 * 1000);
        stops.push({
            name: stations[Math.floor(Math.random() * stations.length)],
            time: trainTime
        });
    }
    trains.push({
        destination: stations[Math.floor(Math.random() * stations.length)],
        time: time,
        platform: Math.floor(Math.random() * 16).toString(),
        delay: 0,
        lineColor: "yellow",
        stops: stops,
        cars: Math.floor(Math.random() * 10) + 2
    });
}

//draw function
function draw () {
    //check for departed trains
    if (trains[0].time < Date.now()) {
        trains.shift();
        generateTrain();
    }
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    octx.clearRect(0, 0, width, height);

    //draw outline
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(pids.x - borderWidth + offsetX, pids.y - borderWidth + offsetY, pids.width + borderWidth * 2, borderWidth);
    ctx.fillRect(pids.x - borderWidth + offsetX, pids.y - borderWidth + offsetY, borderWidth, pids.height + borderWidth * 2);
    ctx.fillRect(pids.x + pids.width + offsetX, pids.y - borderWidth + offsetY, borderWidth, pids.height + borderWidth * 2);
    ctx.fillRect(pids.x - borderWidth + offsetX, pids.y + pids.height + offsetY, pids.width + borderWidth * 2, borderWidth);
    
    //draw gray edge
    ctx.fillStyle = "gray";
    ctx.fillRect(pids.x + offsetX, pids.y + offsetY, pids.width, edgeWidth * pixelSize);
    ctx.fillRect(pids.x + offsetX, pids.y + offsetY + pids.height - edgeWidth * pixelSize, pids.width, edgeWidth * pixelSize);
    ctx.fillRect(pids.x + offsetX, pids.y + offsetY, edgeWidth * pixelSize, pids.height);
    ctx.fillRect(pids.x + offsetX + pids.width - edgeWidth * pixelSize, pids.y + offsetY, edgeWidth * pixelSize, pids.height);

    //draw block grid
    if (drawBorder) {
        ctx.fillStyle = "#444444";
        for (let x = 1; x < pidsWidth / 16; x++) {
            ctx.fillRect(pids.x + x * 16 * pixelSize + offsetX, pids.y + offsetY, 1, pids.height);
        }
        for (let y = 1; y < pidsHeight / 16; y++) {
            ctx.fillRect(pids.x + offsetX, pids.y + y * 16 * pixelSize + offsetY, pids.width, 1);
        }
    }

    ctx.fillStyle = "gray";
    //draw special parts
    if (size == "ha") {
        drawOccupiedBorder(pids.x + offsetX + pixelSize, pids.y + offsetY + pixelSize, pixelSize * 30, pixelSize * 6, 2, "orange");
    } else if (size == "ps") {
        ctx.fillRect(pids.x + offsetX + pixelSize * 6, pids.y + offsetY, pixelSize * 4, pixelSize * 1);
        drawOccupiedBorder(pids.x + offsetX + pixelSize * 6, pids.y + offsetY, pixelSize * 4, pixelSize * 1, 2, "orange");
    } else if (size == "pm") {
        ctx.fillRect(pids.x + offsetX + pixelSize * 21, pids.y + offsetY, pixelSize * 6, pixelSize * 1);
        drawOccupiedBorder(pids.x + offsetX + pixelSize * 21, pids.y + offsetY, pixelSize * 6, pixelSize * 1, 2, "orange");
    } else if (size == "pl") {
        ctx.fillRect(pids.x + offsetX + pixelSize * 20, pids.y + offsetY, pixelSize * 8, pixelSize * 1);
        drawOccupiedBorder(pids.x + offsetX + pixelSize * 20, pids.y + offsetY, pixelSize * 8, pixelSize * 1, 2, "orange");
    }

    //show some guidelines when moving
    if (move.moveT || move.moveA) {
        ctx.fillStyle = "magenta";
        ctx.fillRect(0, modules[selected].y + offsetY, width, 1);
    }
    if (move.moveB || move.moveA) {
        ctx.fillStyle = "magenta";
        ctx.fillRect(0, modules[selected].y + modules[selected].height - 1 + offsetY, width, 1);
    }
    if (move.moveL || move.moveA) {
        ctx.fillStyle = "magenta";
        ctx.fillRect(modules[selected].x + offsetX, 0, 1, height);
    }
    if (move.moveR || move.moveA) {
        ctx.fillStyle = "magenta";
        ctx.fillRect(modules[selected].x + modules[selected].width - 1 + offsetX, 0, 1, height);
    }

    //draw modules
    for (let i = 0; i <  modules.length; i++) {
        modules[i].render(selected == i);
    }

    //module placing preview
    if (move.placing) {
        let startCoords = snapToGrid(move.startX, move.startY, pixelSize, 8, pids.x + offsetX, pids.y + offsetY);
        let dimCoords = snapToGrid(mouse.x - move.startX, mouse.y - move.startY, pixelSize, 8);
        drawModuleBorder("", startCoords[0], startCoords[1], dimCoords[0], dimCoords[1], 1, "#ffffff");
    }

    //draw topbar
    ctx.fillStyle = "#333333";
    ctx.fillRect(0, 0, width, 42);
    ctx.fillStyle = "#444444";
    ctx.fillRect(0, 42, width, 2);

    if (image.complete) {
        //Destination
        let button = buttons.destination;
        ctx.drawImage(image, 160, 0, 32, 32, button.x, button.y, button.width, button.height);
        //Arrival Time
        button = buttons.arrivalTime;
        ctx.drawImage(image, 192, 0, 32, 32, button.x, button.y, button.width, button.height);
        //Train Length
        button = buttons.trainLength;
        ctx.drawImage(image, 224, 0, 32, 32, button.x, button.y, button.width, button.height);
        //Platform Number
        button = buttons.platformNumber;
        ctx.drawImage(image, 0, 32, 32, 32, button.x, button.y, button.width, button.height);
        //Stops At
        button = buttons.stopsAt;
        //ctx.drawImage(image, 32, 32, 32, 32, button.x, button.y, button.width, button.height);

        //Export
        ctx.drawImage(image, 32, 0, 32, 32, width - 37, 5, 32, 32);
        //Import
        ctx.drawImage(image, 0, 0, 32, 32, width - 77, 5, 32, 32);
        //Border
        if (drawBorder) ctx.drawImage(image, 64, 0, 32, 32, width - 117, 5, 32, 32);
        else ctx.drawImage(image, 96, 0, 32, 32, width - 117, 5, 32, 32);
        //New
        ctx.drawImage(image, 128, 0, 32, 32, width - 157, 5, 32, 32);
    }

    //draw properties editor
    if (selected >= 0) {
        ctx.fillStyle = "#333333";
        ctx.fillRect(width - 300, 44, 300, height);
        ctx.fillStyle = "#444444";
        ctx.fillRect(width - 302, 44, 2, height);
        //module name
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px Consolas,'Courier New',monospace";
        ctx.textAlign = "center";
        ctx.fillText(modules[selected].name, Math.floor(width - 150), 54);
        //close button
        ctx.fillStyle = "#444444";
        ctx.fillRect(width - 26, 50, 20, 20);
        ctx.fillStyle = "#ffffff";
        ctx.fillText("X", width - 16, 54);
        //module position
        ctx.font = "12px Consolas,'Courier New',monospace";
        ctx.textAlign = "left";
        ctx.fillText("X: " + (modules[selected].x - pids.x) / pixelSize, width - 290, 84);
        ctx.fillText("Y: " + (modules[selected].y - pids.y) / pixelSize, width - 160, 84);
        ctx.fillText("W: " + modules[selected].width / pixelSize, width - 290, 104);
        ctx.fillText("H: " + modules[selected].height / pixelSize, width - 160, 104);
        //properties
        let y = 124;
        for (const option of Object.keys(modules[selected].options)) {
            if (option == "align") {
                let align = modules[selected].options[option];
                ctx.fillText("Align:", width - 290, y + 5);
                ctx.fillStyle = align == "left" ? "#777777" : "#444444";
                ctx.fillRect(width - 200, y - 5, 30, 30);
                ctx.fillStyle = align == "center" ? "#777777" : "#444444";
                ctx.fillRect(width - 160, y - 5, 30, 30);
                ctx.fillStyle = align == "right" ? "#777777" : "#444444";
                ctx.fillRect(width - 120, y - 5, 30, 30);
                ctx.fillStyle = "#ffffff";
                buttons.align.left = {
                    x: width - 200,
                    y: y - 5,
                    width: 30,
                    height: 30
                };
                buttons.align.center = {
                    x: width - 160,
                    y: y - 5,
                    width: 30,
                    height: 30
                };
                buttons.align.right = {
                    x: width - 120,
                    y: y - 5,
                    width: 30,
                    height: 30
                };
                //Left
                ctx.fillRect(width - 196, y - 1, 2, 22);
                ctx.fillRect(width - 196, y + 6, 16, 6);
                //Center
                ctx.fillRect(width - 146, y - 1, 2, 22);
                ctx.fillRect(width - 153, y + 6, 16, 6);
                //Right
                ctx.fillRect(width - 96, y - 1, 2, 22);
                ctx.fillRect(width - 110, y + 6, 16, 6);
                y += 36;
            } else if (option == "color") {
                ctx.fillStyle = "#ffffff";
                ctx.fillText("Color:", width - 290, y);
                ctx.fillStyle = modules[selected].options[option];
                ctx.fillRect(width - 200, y - 3, 110, 16);
                buttons.color = {
                    x: width - 200,
                    y: y - 3,
                    width: 110,
                    height: 16
                };
                ctx.strokeStyle = "gray";
                ctx.lineWidth = 2;
                ctx.strokeRect(width - 200, y - 3, 110, 16);
                y += 24;
            } else if (option == "arrival") {
                ctx.fillStyle = "#ffffff";
                ctx.fillText("Arrival #", width - 290, y);
                ctx.textAlign = "center";
                ctx.fillText(modules[selected].options[option] + 1, width - 146, y);
                //plus and minus buttons
                ctx.fillStyle = "#444444";
                ctx.lineWidth = 2;
                ctx.fillRect(width - 130, y - 4, 19, 19);
                ctx.fillRect(width - 106, y - 4, 19, 19);
                ctx.fillRect(width - 180, y - 4, 19, 19);
                ctx.fillRect(width - 206, y - 4, 19, 19);
                ctx.fillStyle = "#ffffff";
                ctx.fillText("+", width - 121, y);
                ctx.fillText("++", width - 96, y);
                ctx.fillText("-", width - 171, y);
                ctx.fillText("--", width - 196, y);
                buttons.arrival.plus = {
                    x: width - 130,
                    y: y - 4,
                    width: 19,
                    height: 19
                };
                buttons.arrival.plusPlus = {
                    x: width - 106,
                    y: y - 4,
                    width: 19,
                    height: 19
                };
                buttons.arrival.minus = {
                    x: width - 180,
                    y: y - 4,
                    width: 19,
                    height: 19
                };
                buttons.arrival.minusMinus = {
                    x: width - 206,
                    y: y - 4,
                    width: 19,
                    height: 19
                };
                y += 24;
            } else {
                ctx.fillStyle = "#ffffff";
                ctx.fillText(option[0].toUpperCase() + option.slice(1) + ": " + modules[selected].options[option], width - 290, y);
                y += 20;
            }
        }
        //delete button
        ctx.fillStyle = "#550000";
        ctx.fillRect(width - 290, height - 36, 280, 26);
        ctx.fillStyle = "#ff0000";
        ctx.font = "16px Consolas,'Courier New',monospace";
        ctx.textAlign = "center";
        ctx.fillText("Delete Module", width - 150, height - 30);
    }

    //draw mouse tooltip
    if (!exportMenu) {
        octx.font = "12px Consolas,'Courier New',monospace";
        octx.textAlign = "left";
        octx.fillStyle = "#00000099";
        octx.textBaseline = "top";
        if (move.placing) {
            let dimCoords = snapToGrid(mouse.x - move.startX, mouse.y - move.startY, pixelSize, 8);
            octx.fillRect(mouse.x + 10, mouse.y - 5, Math.max(octx.measureText("Placing: " + mouse.place).width, octx.measureText(`Relative Size: ${Math.abs(dimCoords[0] / pixelSize)}x${Math.abs(dimCoords[1] / pixelSize)}`).width, octx.measureText(`Screen Size: ${Math.abs(dimCoords[0])}x${Math.abs(dimCoords[1])}`).width) + 10, 52);
            octx.fillStyle = "#ffffff";
            octx.fillText("Placing: " + mouse.place, mouse.x + 15, mouse.y);
            octx.fillText(`Relative Size: ${Math.abs(dimCoords[0] / pixelSize)}x${Math.abs(dimCoords[1] / pixelSize)}`, mouse.x + 15, mouse.y + 15);
            octx.fillText(`Screen Size: ${Math.abs(dimCoords[0])}x${Math.abs(dimCoords[1])}`, mouse.x + 15, mouse.y + 30);
        } else if (mouse.place) displayTooltip("Placing: " + mouse.place);
        else if (pointInBoxObject(mouse.x, mouse.y, buttons.destination)) displayTooltip("DestinationModule");
        else if (pointInBoxObject(mouse.x, mouse.y, buttons.arrivalTime)) displayTooltip("ArrivalTimeModule");
        else if (pointInBoxObject(mouse.x, mouse.y, buttons.trainLength)) displayTooltip("TrainLengthModule");
        else if (pointInBoxObject(mouse.x, mouse.y, buttons.platformNumber)) displayTooltip("PlatformNumberModule");
        else if (pointInBoxObject(mouse.x, mouse.y, buttons.export)) displayTooltip("Save / Export", true);
        else if (pointInBoxObject(mouse.x, mouse.y, buttons.import)) displayTooltip("Load / Import", true);
        else if (pointInBoxObject(mouse.x, mouse.y, buttons.border)) displayTooltip("Toggle Border", true);
        else if (pointInBoxObject(mouse.x, mouse.y, buttons.new)) displayTooltip("Create New", true);
    }

    //debug stuff
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Consolas,'Courier New',monospace";
    ctx.textAlign = "left";
    ctx.fillText(VERSION, 5, height - 15);
    //ctx.fillText("Mouse X: " + mouse.x, 10, 10);
    //ctx.fillText("Mouse Y: " + mouse.y, 10, 20);
}

setInterval(draw, 1000 / 30);

//some utility functions
function drawModuleBorder (name, x, y, width, height, weight, color) {
    ctx.font = "10px Consolas,'Courier New',monospace";
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(name, x + 2, y + 2);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, weight);
    ctx.fillRect(x, y, weight, height);
    ctx.fillRect(x + width - weight, y, weight, height);
    ctx.fillRect(x, y + height - weight, width, weight);
}

function drawOccupiedBorder (x, y, width, height, weight, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = weight;
    ctx.beginPath();
    ctx.rect(x + weight / 2, y + weight / 2, width - weight, height - weight);
    ctx.moveTo(x + weight / 2, y + weight / 2);
    ctx.lineTo(x + width - weight / 2, y + height - weight / 2);
    ctx.moveTo(x + width - weight / 2, y + weight / 2);
    ctx.lineTo(x + weight / 2, y + height - weight / 2);
    ctx.stroke();
}

function pointInBox (x, y, bx, by, bw, bh) {
    return x > bx && x < bx + bw && y > by && y < by + bh;
}

function pointInBoxObject (x, y, box) {
    return x > box.x && x < box.x + box.width && y > box.y && y < box.y + box.height;
}

function snapToGrid (x, y, size, subdiv = 1, offsetX = 0, offsetY = 0) {
    return [
        Math.round((x - offsetX) / size * subdiv) * size / subdiv + offsetX,
        Math.round((y - offsetY) / size * subdiv) * size / subdiv + offsetY
    ]
}

function displayTooltip (text, right=false) {
    octx.fillStyle = "#00000099";
    if (right) {
        octx.fillRect(mouse.x - 20 - octx.measureText(text).width, mouse.y - 5, octx.measureText(text).width + 10, 22);
    } else {
        octx.fillRect(mouse.x + 10, mouse.y - 5, octx.measureText(text).width + 10, 22);
    }
    octx.fillStyle = "#ffffff";
    if (right) {
        octx.textAlign = "right";
        octx.fillText(text, mouse.x - 15, mouse.y);
    } else {
        octx.textAlign = "left";
        octx.fillText(text, mouse.x + 15, mouse.y);
    }
}

function loadJSON (json) {
    try {
        info = {
            id: "",
            name: "",
            author: "",
            description: ""
        }
        if (json._editor_size) {
            size = json._editor_size;
            pidsWidth = sizes[size].width;
            pidsHeight = sizes[size].height;
            edgeWidth = sizes[size].edge;
            pids = {
                width: pidsWidth * pixelSize,
                height: pidsHeight * pixelSize,
                x: Math.floor(width / 2 - pidsWidth * pixelSize / 2),
                y: Math.floor(height / 2 - pidsHeight * pixelSize / 2)
            }
        }
        if (json.id) info.id = json.id;
        if (json.name) info.name = json.name;
        if (json.author) info.author = json.author;
        if (json.description) info.description = json.description;
        modules = [];
        selected = -1;
        for (const module of json.modules) {
            let x = module.pos.x * pixelSize + pids.x;
            let y = module.pos.y * pixelSize + pids.y;
            let w = module.pos.w * pixelSize;
            let h = module.pos.h * pixelSize;
            if (module.type == "DestinationModule") modules.push(new DestinationModule(x, y, w, h, {align: module.align, color: "#" + module.color.toString(16).padStart(6, "0"), arrival: module.arrival}));
            if (module.type == "ArrivalTimeModule") modules.push(new ArrivalTimeModule(x, y, w, h, {align: module.align, color: "#" + module.color.toString(16).padStart(6, "0"), arrival: module.arrival}));
            if (module.type == "TrainLengthModule") modules.push(new TrainLengthModule(x, y, w, h, {align: module.align, color: "#" + module.color.toString(16).padStart(6, "0"), arrival: module.arrival}));
            if (module.type == "PlatformNumberModule") modules.push(new PlatformNumberModule(x, y, w, h, {align: module.align, color: "#" + module.color.toString(16).padStart(6, "0"), arrival: module.arrival}));
            modules[modules.length - 1].import(module);
        }
    } catch (e) {
        alert("Invalid Layout Format!");
    }
}

//event listeners
document.addEventListener("keydown", (e) => {
    if (exportMenu) {
        if (e.code === "Escape") {
            exportMenu = false;
            document.getElementById("exportMenu").style.display = "none";
        }
        return;
    }

    if (e.code === "Escape") {
        selected = -1;
    }
    if (e.code === "KeyB") {
        drawBorder = !drawBorder;
    }

    //editing tools
    if (selected >= 0) {
        //delete key
        if (e.code === "Delete" || e.code === "Backspace") {
            modules.splice(selected, 1);
            selected = -1;
            return;
        }

        //duplicate key
        if (e.code === "KeyD") {
            let newModule = -1;
            newModule += modules.push(modules[selected].duplicate());
            selected = newModule;
        }

        //nudge bottom right point
        if (e.shiftKey) {
            if (e.code === "ArrowLeft") {
                modules[selected].x -= pixelSize * 0.125;
                modules[selected].width += pixelSize * 0.125;
            }
            if (e.code === "ArrowRight") {
                modules[selected].x += pixelSize * 0.125;
                modules[selected].width -= pixelSize * 0.125;
            }
            if (e.code === "ArrowUp") {
                modules[selected].y -= pixelSize * 0.125;
                modules[selected].height += pixelSize * 0.125;
            }
            if (e.code === "ArrowDown") {
                modules[selected].y += pixelSize * 0.125;
                modules[selected].height -= pixelSize * 0.125;
            }

        //nudge top left point
        } else if (e.ctrlKey) {
            if (e.code === "ArrowLeft") {
                modules[selected].width -= pixelSize * 0.125;
            }
            if (e.code === "ArrowRight") {
                modules[selected].width += pixelSize * 0.125;
            }
            if (e.code === "ArrowUp") {
                modules[selected].height -= pixelSize * 0.125;
            }
            if (e.code === "ArrowDown") {
                modules[selected].height += pixelSize * 0.125;
            }

        //nudge whole module
        } else {
            if (e.code === "ArrowLeft") {
                modules[selected].x -= pixelSize * 0.125;
            }
            if (e.code === "ArrowRight") {
                modules[selected].x += pixelSize * 0.125;
            }
            if (e.code === "ArrowUp") {
                modules[selected].y -= pixelSize * 0.125;
            }
            if (e.code === "ArrowDown") {
                modules[selected].y += pixelSize * 0.125;
            }
        }

        //add to arrival
        if (e.code === "Equal") {
            //shift for 4
            if (e.shiftKey) {
                modules[selected].options.arrival += 3;
                modules[selected].arrival += 3;
            }
            modules[selected].options.arrival++;
            modules[selected].arrival++;
        }

        //subtract from arrival
        if (e.code === "Minus") {
            //shift for 4
            if (e.shiftKey) {
                modules[selected].options.arrival -= 3;
                modules[selected].arrival -= 3;
            }
            modules[selected].options.arrival--;
            modules[selected].arrival--;
            //minimum 0
            if (modules[selected].options.arrival < 0) modules[selected].options.arrival = 0;
            if (modules[selected].arrival < 0) modules[selected].arrival = 0;
        }
    }
});

document.addEventListener("keyup", (e) => {
    //validate export fields
    document.getElementById("exportID").value = document.getElementById("exportID").value.replace(/[^a-zA-Z0-9_]/g, "");
});

document.getElementById("canvas").addEventListener("mousemove", (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
    let xMoveConstant = Math.round((mouse.x - offsetX - mouse.startX) / pixelSize * 8) * pixelSize / 8;
    let yMoveConstant = Math.round((mouse.y - offsetY -  mouse.startY) / pixelSize * 8) * pixelSize / 8;
    if (move.moveT) {
        modules[selected].y = move.startY + yMoveConstant;
        modules[selected].height = move.startHeight - yMoveConstant;
    }
    if (move.moveB) {
        modules[selected].height = move.startHeight + yMoveConstant;
    }
    if (move.moveL) {
        modules[selected].x = move.startX + xMoveConstant;
        modules[selected].width = move.startWidth - xMoveConstant;
    }
    if (move.moveR) {
        modules[selected].width = move.startWidth + xMoveConstant;
    }
    if (move.moveA) {
        modules[selected].x = move.startX + xMoveConstant;
        modules[selected].y = move.startY + yMoveConstant;
    }
    if (mouse.pan) {
        offsetX = move.startX + (mouse.x - mouse.startX);
        offsetY = move.startY + (mouse.y - mouse.startY);
    }
});

document.getElementById("canvas").addEventListener("mousedown", (e) => {
    mouse.startX = e.offsetX;
    mouse.startY = e.offsetY;
    if (e.button === 0 && !exportMenu) {
        //module placing logic
        if (mouse.place) {
            move.placing = true;
            move.startX = mouse.startX;
            move.startY = mouse.startY;
            return;
        }
        //toolbar button logic
        if (mouse.startY < 40) {
            if (pointInBoxObject(mouse.startX, mouse.startY, buttons.destination)) mouse.place = "DestinationModule";
            else if (pointInBoxObject(mouse.startX, mouse.startY, buttons.arrivalTime)) mouse.place = "ArrivalTimeModule";
            else if (pointInBoxObject(mouse.startX, mouse.startY, buttons.trainLength)) mouse.place = "TrainLengthModule";
            else if (pointInBoxObject(mouse.startX, mouse.startY, buttons.platformNumber)) mouse.place = "PlatformNumberModule";
            else if (pointInBoxObject(mouse.startX, mouse.startY, buttons.export)) {
                exportMenu = true;
                document.getElementById("exportID").value = info.id;
                document.getElementById("exportName").value = info.name;
                document.getElementById("exportAuthor").value = info.author;
                document.getElementById("exportDescription").value = info.description;
                document.getElementById("exportMenu").style.display = "block";
            } else if (pointInBoxObject(mouse.startX, mouse.startY, buttons.import)) {
                //create a new file input element
                try {
                let fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = ".json";
                fileInput.style.display = "none";
                fileInput.addEventListener("change", (e) => {
                    let file = e.target.files[0];
                    let reader = new FileReader();
                    reader.readAsText(file, "UTF-8");
                    reader.onload = (e) => {
                        try {
                            loadJSON(JSON.parse(e.target.result));
                        } catch (e) {
                            alert("Invalid JSON!");
                        }
                    }
                });
                document.body.appendChild(fileInput);
                fileInput.click();
                } catch (e) {alert(e.stack);}
            } else if (pointInBoxObject(mouse.startX, mouse.startY, buttons.border)) drawBorder = !drawBorder;
            else if (pointInBoxObject(mouse.startX, mouse.startY, buttons.new)) {
                modules = [];
                selected = -1
                size = document.getElementById("size").value;
                pidsWidth = sizes[size].width;
                pidsHeight = sizes[size].height;
                edgeWidth = sizes[size].edge;
                pixelSize = sizes[size].pixel;
                pids = {
                    width: pidsWidth * pixelSize,
                    height: pidsHeight * pixelSize,
                    x: Math.floor(width / 2 - pidsWidth * pixelSize / 2),
                    y: Math.floor(height / 2 - pidsHeight * pixelSize / 2)
                }
                if (sizes[size].default) {
                    loadJSON(sizes[size].default);
                }
            }
            return;
        }
        //sidebar button logic
        if (mouse.startX > width - 200) {
            //delete button
            if (pointInBox(mouse.startX, mouse.startY, width - 290, height - 36, 280, 26)) {
                modules.splice(selected, 1);
                selected = -1;
                return;
            }
            //align buttons
            if (modules[selected].options.align) {
                if (pointInBox(mouse.startX, mouse.startY, buttons.align.left.x, buttons.align.left.y, buttons.align.left.width, buttons.align.left.height)) {
                    modules[selected].options.align = "left";
                    return;
                }
                if (pointInBox(mouse.startX, mouse.startY, buttons.align.center.x, buttons.align.center.y, buttons.align.center.width, buttons.align.center.height)) {
                    modules[selected].options.align = "center";
                    return;
                }
                if (pointInBox(mouse.startX, mouse.startY, buttons.align.right.x, buttons.align.right.y, buttons.align.right.width, buttons.align.right.height)) {
                    modules[selected].options.align = "right";
                    return;
                }
            }
            //color button
            if (modules[selected].options.color) {
                if (pointInBox(mouse.startX, mouse.startY, buttons.color.x, buttons.color.y, buttons.color.width, buttons.color.height)) {
                    let color = prompt("Enter a color", modules[selected].options.color, "#ffffff");
                    if (/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color)) {
                        modules[selected].options.color = color;
                    } else {
                        alert("Invalid hex color");
                    }
                    return;
                }
            }
            //arrival buttons
            if (modules[selected].options.arrival !== undefined) {
                if (pointInBox(mouse.startX, mouse.startY, buttons.arrival.plus.x, buttons.arrival.plus.y, buttons.arrival.plus.width, buttons.arrival.plus.height)) {
                    modules[selected].options.arrival++;
                    modules[selected].arrival++;
                    return;
                }
                if (pointInBox(mouse.startX, mouse.startY, buttons.arrival.plusPlus.x, buttons.arrival.plusPlus.y, buttons.arrival.plusPlus.width, buttons.arrival.plusPlus.height)) {
                    modules[selected].options.arrival += 4;
                    modules[selected].arrival += 4;
                    return;
                }
                if (pointInBox(mouse.startX, mouse.startY, buttons.arrival.minus.x, buttons.arrival.minus.y, buttons.arrival.minus.width, buttons.arrival.minus.height)) {
                    modules[selected].options.arrival = Math.max(0, modules[selected].options.arrival - 1);
                    modules[selected].arrival = Math.max(0, modules[selected].arrival - 1);
                    
                    return;
                }
                if (pointInBox(mouse.startX, mouse.startY, buttons.arrival.minusMinus.x, buttons.arrival.minusMinus.y, buttons.arrival.minusMinus.width, buttons.arrival.minusMinus.height)) {
                    modules[selected].options.arrival = Math.max(0, modules[selected].options.arrival - 4);
                    modules[selected].arrival = Math.max(0, modules[selected].arrival - 4);
                    return;
                }
            }
            return;
        }
        mouse.startX -= offsetX;
        mouse.startY -= offsetY;
        if (selected >= 0){
            move.startX = modules[selected].x;
            move.startY = modules[selected].y;
            move.startWidth = modules[selected].width;
            move.startHeight = modules[selected].height;
            //if mouse is over an anchor point, enable resizing
            //TL
            if (pointInBox(mouse.startX, mouse.startY, modules[selected].x - 3, modules[selected].y - 3, 7, 7)) {
                move.moveT = true;
                move.moveL = true;
                return;
            }
            //T
            if (pointInBox(mouse.startX, mouse.startY, modules[selected].x + modules[selected].width / 2 - 3, modules[selected].y - 3, 7, 7)) {
                move.moveT = true;
                return;
            }
            //TR
            if (pointInBox(mouse.startX, mouse.startY, modules[selected].x + modules[selected].width - 4, modules[selected].y - 3, 7, 7)) {
                move.moveT = true;
                move.moveR = true;
                return;
            }
            //L
            if (pointInBox(mouse.startX, mouse.startY, modules[selected].x - 3, modules[selected].y + modules[selected].height / 2 - 3, 7, 7)) {
                move.moveL = true;
                return;
            }
            //R
            if (pointInBox(mouse.startX, mouse.startY, modules[selected].x + modules[selected].width - 4, modules[selected].y + modules[selected].height / 2 - 3, 7, 7)) {
                move.moveR = true;
                return;
            }
            //BL
            if (pointInBox(mouse.startX, mouse.startY, modules[selected].x - 3, modules[selected].y + modules[selected].height - 4, 7, 7)) {
                move.moveB = true;
                move.moveL = true;
                return;
            }
            //B
            if (pointInBox(mouse.startX, mouse.startY, modules[selected].x + modules[selected].width / 2 - 3, modules[selected].y + modules[selected].height - 4, 7, 7)) {
                move.moveB = true;
                return;
            }
            //BR
            if (pointInBox(mouse.startX, mouse.startY, modules[selected].x + modules[selected].width - 4, modules[selected].y + modules[selected].height - 4, 7, 7)) {
                move.moveB = true;
                move.moveR = true;
                return;
            }
        }
        //check for other modules before doing generic move
        let newModule = false;
        for (let i = 0; i < modules.length; i++) {
            if (selected != i && pointInBox(mouse.startX, mouse.startY, modules[i].x, modules[i].y, modules[i].width, modules[i].height)) {
                selected = i;
                newModule = true;
                break;
            }
        }
        if (selected >= 0 && !newModule) {
            //if mouse is over the module, enable moving
            if (pointInBox(mouse.startX, mouse.startY, modules[selected].x, modules[selected].y, modules[selected].width, modules[selected].height)) {
                move.moveA = true;
                return;
            }
        }
    } else if (e.button === 2) {
        e.preventDefault();
        mouse.pan = true;
        move.startX = offsetX;
        move.startY = offsetY;
    }
});

document.getElementById("canvas").addEventListener("mouseup", (e) => {
    move.moveT = false;
    move.moveB = false;
    move.moveL = false;
    move.moveR = false;
    move.moveA = false;
    mouse.pan = false;
    if (move.placing) {
        move.placing = false;
        let startCoords = snapToGrid(move.startX, move.startY, pixelSize, 8, pids.x + offsetX, pids.y + offsetY);
        let dimCoords = snapToGrid(mouse.x - move.startX, mouse.y - move.startY, pixelSize, 8);
        //abort if any dimension is 0
        if (dimCoords[0] === 0 || dimCoords[1] === 0) return;
        //fix negative width or height
        if (dimCoords[0] < 0) {
            startCoords[0] += dimCoords[0];
            dimCoords[0] = Math.abs(dimCoords[0]);
        }
        if (dimCoords[1] < 0) {
            startCoords[1] += dimCoords[1];
            dimCoords[1] = Math.abs(dimCoords[1]);
        }
        //place module
        let newModule = -1;
        if (mouse.place == "DestinationModule") newModule += modules.push(new DestinationModule(startCoords[0] - offsetX, startCoords[1] - offsetY, dimCoords[0], dimCoords[1], {align: "left", color: "#ffffff", arrival: 0}));
        else if (mouse.place == "ArrivalTimeModule") newModule += modules.push(new ArrivalTimeModule(startCoords[0] - offsetX, startCoords[1] - offsetY, dimCoords[0], dimCoords[1], {align: "left", color: "#ffffff", arrival: 0}));
        else if (mouse.place == "TrainLengthModule") newModule += modules.push(new TrainLengthModule(startCoords[0] - offsetX, startCoords[1] - offsetY, dimCoords[0], dimCoords[1], {align: "left", color: "#ffffff", arrival: 0}));
        else if (mouse.place == "PlatformNumberModule") newModule += modules.push(new PlatformNumberModule(startCoords[0] - offsetX, startCoords[1] - offsetY, dimCoords[0], dimCoords[1], {align: "left", color: "#ffffff", arrival: 0}));
        mouse.place = null;
        selected = newModule;
    }
    //fix any negative width or height
    if (selected >= 0) {
        if (modules[selected].width < 0) {
            modules[selected].x += modules[selected].width;
            modules[selected].width = Math.abs(modules[selected].width);
        }
        if (modules[selected].height < 0) {
            modules[selected].y += modules[selected].height;
            modules[selected].height = Math.abs(modules[selected].height);
        }
    }
});

//export menu buttons
document.getElementById("cancelButton").addEventListener("click", () => {
    exportMenu = false;
    document.getElementById("exportMenu").style.display = "none";
});

document.getElementById("exportButton").addEventListener("click", () => {
    let data = {
        _editor_size: size,
        id: document.getElementById("exportID").value,
        modules: modules.map(m => m.export())
    }
    if (data.id.length === 0) {
        alert("ID cannot be empty");
        return;
    }

    let name = document.getElementById("exportName").value;
    if (name.length > 0) {
        data.name = name;
    }

    let author = document.getElementById("exportAuthor").value;
    if (author.length > 0) {
        data.author = author;
    }

    let description = document.getElementById("exportDescription").value;
    if (description.length > 0) {
        data.description = description;
    }

    if (data.id) info.id = data.id;
    if (data.name) info.name = data.name;
    if (data.author) info.author = data.author;
    if (data.description) info.description = data.description;

    let blob = new Blob([JSON.stringify(data)], {type: "application/json"});
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = data.id + ".json";
    a.click();
    URL.revokeObjectURL(url);
    exportMenu = false;
    document.getElementById("exportMenu").style.display = "none";
});

draw();