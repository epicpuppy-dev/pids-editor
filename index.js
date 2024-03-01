const canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const image = new Image();
image.src = "sprites.png";

/*
Some scale stuff
1 block = 16 in-game pixels
1 in-game pixel = PIXEL_SIZE screen pixels
*/

ctx.fillStyle = "black";
ctx.fillRect(0, 0, width, height);
ctx.fillStyle = "#ffffff";
ctx.textBaseline = "top";

const PIDS_WIDTH = 32;
const PIDS_HEIGHT = 9;

const PIXEL_SIZE = 24;
const BORDER_WIDTH = 4;
const PIDS = {
    WIDTH: PIDS_WIDTH * PIXEL_SIZE,
    HEIGHT: PIDS_HEIGHT * PIXEL_SIZE,
    X: Math.floor(width / 2 - PIDS_WIDTH * PIXEL_SIZE / 2),
    Y: Math.floor(height / 2 - PIDS_HEIGHT * PIXEL_SIZE / 2)
}
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
    id: "",
    name: "",
    author: "",
    description: ""
}
let typing = 3;
let cursorBlink = 0;
let cursorLine = 0;
let cursorPos = 0;

class Module {
    constructor (name, x, y, width, height) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    render (text, align, color, selected) {
        let textMaxWidth = this.width - PIXEL_SIZE * 0.5;
        let textMaxHeight = this.height - PIXEL_SIZE * 0;
        let textX = this.x + PIXEL_SIZE * 0.25;
        ctx.textAlign = align;
        ctx.fillStyle = color;
        textX = Math.floor(textX);
        if (align === "center") textX = Math.floor(this.x + this.width / 2);
        else if (align === "right") textX = Math.floor(this.x + this.width - PIXEL_SIZE * 0.25);
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
                x: (this.x - PIDS.X) / PIXEL_SIZE,
                y: (this.y - PIDS.Y) / PIXEL_SIZE,
                w: this.width / PIXEL_SIZE,
                h: this.height / PIXEL_SIZE
            }
        }
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
                x: (this.x - PIDS.X) / PIXEL_SIZE,
                y: (this.y - PIDS.Y) / PIXEL_SIZE,
                w: this.width / PIXEL_SIZE,
                h: this.height / PIXEL_SIZE
            },
            align: this.options.align,
            color: parseInt(this.options.color.slice(1), 16),
            arrival: this.arrival
        }
    }

    load (data) {
        if (data.align) this.options.align = data.align;
        if (data.color) this.options.color = "#" + data.color.toString(16);
        if (data.arrival) this.arrival = data.arrival;
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

    export () {
        return {
            type: "ArrivalTimeModule",
            pos: {
                x: (this.x - PIDS.X) / PIXEL_SIZE,
                y: (this.y - PIDS.Y) / PIXEL_SIZE,
                w: this.width / PIXEL_SIZE,
                h: this.height / PIXEL_SIZE
            },
            align: this.options.align,
            color: parseInt(this.options.color.slice(1), 16),
            arrival: this.arrival
        }
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

    export () {
        return {
            type: "TrainLengthModule",
            pos: {
                x: (this.x - PIDS.X) / PIXEL_SIZE,
                y: (this.y - PIDS.Y) / PIXEL_SIZE,
                w: this.width / PIXEL_SIZE,
                h: this.height / PIXEL_SIZE
            },
            align: this.options.align,
            color: parseInt(this.options.color.slice(1), 16),
            arrival: this.arrival
        }
    }
}

//let modules = [];

// 1x2 8 Arrivals
/*
let y = 1.5;
for (let i = 0; i < 8; i++) {
    modules.push(new DestinationModule(PIDS.X + PIXEL_SIZE * 1.5, PIDS.Y + PIXEL_SIZE * y, PIDS.WIDTH - PIXEL_SIZE * 3, PIDS.HEIGHT - PIXEL_SIZE * 30.5, {align: "left", color: "#ffa500", arrival: i}));
    modules.push(new TrainLengthModule(PIDS.X + PIXEL_SIZE * 1.5, PIDS.Y + PIXEL_SIZE * (y + 1.75), PIDS.WIDTH - PIXEL_SIZE * 10, PIDS.HEIGHT - PIXEL_SIZE * 30.5, {align: "left", color: "#ff0000", arrival: i}));
    modules.push(new ArrivalTimeModule(PIDS.X + PIXEL_SIZE * 8.5, PIDS.Y + PIXEL_SIZE * (y + 1.75), PIDS.WIDTH - PIXEL_SIZE * 10, PIDS.HEIGHT - PIXEL_SIZE * 30.5, {align: "right", color: "#ffa500", arrival: i}));
    y += 3.625;
}
*/

// 2x1 3 Arrivals

let modules = [
    new DestinationModule(PIDS.X + PIXEL_SIZE * 1.5, PIDS.Y + PIXEL_SIZE * 1.5, PIDS.WIDTH - PIXEL_SIZE * 9.5, PIDS.HEIGHT - PIXEL_SIZE * 7.25, {align: "left", color: "#ffffff", arrival: 0}),
    new DestinationModule(PIDS.X + PIXEL_SIZE * 1.5, PIDS.Y + PIXEL_SIZE * 3.625, PIDS.WIDTH - PIXEL_SIZE * 9.5, PIDS.HEIGHT - PIXEL_SIZE * 7.25, {align: "left", color: "#ffffff", arrival: 1}),
    new DestinationModule(PIDS.X + PIXEL_SIZE * 1.5, PIDS.Y + PIXEL_SIZE * 5.75, PIDS.WIDTH - PIXEL_SIZE * 9.5, PIDS.HEIGHT - PIXEL_SIZE * 7.25, {align: "left", color: "#ffffff", arrival: 2}),
    new ArrivalTimeModule(PIDS.X + PIXEL_SIZE * 24.5, PIDS.Y + PIXEL_SIZE * 1.5, PIDS.WIDTH - PIXEL_SIZE * 26, PIDS.HEIGHT - PIXEL_SIZE * 7.25, {align: "right", color: "#00ff00", arrival: 0}),
    new ArrivalTimeModule(PIDS.X + PIXEL_SIZE * 24.5, PIDS.Y + PIXEL_SIZE * 3.625, PIDS.WIDTH - PIXEL_SIZE * 26, PIDS.HEIGHT - PIXEL_SIZE * 7.25, {align: "right", color: "#ffffff", arrival: 1}),
    new ArrivalTimeModule(PIDS.X + PIXEL_SIZE * 24.5, PIDS.Y + PIXEL_SIZE * 5.75, PIDS.WIDTH - PIXEL_SIZE * 26, PIDS.HEIGHT - PIXEL_SIZE * 7.25, {align: "right", color: "#ffa500", arrival: 2})
]

/** @type {{destination: string, time: number, platform: string, delay: number, lineColor: string, stops: string[], cars: number}[]} */
let trains = [];

const stations = [
    "Desert Grand Central",
    "Geneva Junction",
    "Reston Intermodal",
    "Northview Central",
    "Fairlantis",
    "Sutton",
    "Fairview Junction",
    "Marble Arch",
    "Fairview Docks",
    "Fairview Oasis",
    "Fairview Oasis North",
    "Northview Island South",
    "Northview Island",
    "Northview Island North",
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

    //draw outline
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(PIDS.X - BORDER_WIDTH + offsetX, PIDS.Y - BORDER_WIDTH + offsetY, PIDS.WIDTH + BORDER_WIDTH * 2, BORDER_WIDTH);
    ctx.fillRect(PIDS.X - BORDER_WIDTH + offsetX, PIDS.Y - BORDER_WIDTH + offsetY, BORDER_WIDTH, PIDS.HEIGHT + BORDER_WIDTH * 2);
    ctx.fillRect(PIDS.X + PIDS.WIDTH + offsetX, PIDS.Y - BORDER_WIDTH + offsetY, BORDER_WIDTH, PIDS.HEIGHT + BORDER_WIDTH * 2);
    ctx.fillRect(PIDS.X - BORDER_WIDTH + offsetX, PIDS.Y + PIDS.HEIGHT + offsetY, PIDS.WIDTH + BORDER_WIDTH * 2, BORDER_WIDTH);
    
    //draw gray border
    ctx.fillStyle = "gray";
    ctx.fillRect(PIDS.X + offsetX, PIDS.Y + offsetY, PIDS.WIDTH, PIXEL_SIZE);
    ctx.fillRect(PIDS.X + offsetX, PIDS.Y + offsetY + PIDS.HEIGHT - PIXEL_SIZE, PIDS.WIDTH, PIXEL_SIZE);
    ctx.fillRect(PIDS.X + offsetX, PIDS.Y + offsetY, PIXEL_SIZE, PIDS.HEIGHT);
    ctx.fillRect(PIDS.X + offsetX + PIDS.WIDTH - PIXEL_SIZE, PIDS.Y + offsetY, PIXEL_SIZE, PIDS.HEIGHT);


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
        let startCoords = snapToGrid(move.startX, move.startY, PIXEL_SIZE, 8, PIDS.X + offsetX, PIDS.Y + offsetY);
        let dimCoords = snapToGrid(mouse.x - move.startX, mouse.y - move.startY, PIXEL_SIZE, 8);
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
        ctx.drawImage(image, 64, 0, 32, 32, button.x, button.y, button.width, button.height);
        //Arrival Time
        button = buttons.arrivalTime;
        ctx.drawImage(image, 96, 0, 32, 32, button.x, button.y, button.width, button.height);
        //Train Length
        button = buttons.trainLength;
        ctx.drawImage(image, 128, 0, 32, 32, button.x, button.y, button.width, button.height);

        //Export
        ctx.drawImage(image, 32, 0, 32, 32, width - 37, 5, 32, 32);
        //Import
        ctx.drawImage(image, 0, 0, 32, 32, width - 77, 5, 32, 32);
        //Border
        if (drawBorder) ctx.drawImage(image, 160, 0, 32, 32, width - 117, 5, 32, 32);
        else ctx.drawImage(image, 192, 0, 32, 32, width - 117, 5, 32, 32);
    }

    //draw properties editor
    if (selected >= 0) {
        ctx.fillStyle = "#333333";
        ctx.fillRect(width - 300, 44, 300, height);
        ctx.fillStyle = "#444444";
        ctx.fillRect(width - 302, 44, 2, height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px Consolas,'Courier New',monospace";
        ctx.textAlign = "center";
        ctx.fillText(modules[selected].name, Math.floor(width - 150), 54);
        ctx.font = "12px Consolas,'Courier New',monospace";
        ctx.textAlign = "left";
        ctx.fillText("X: " + (modules[selected].x - PIDS.X) / PIXEL_SIZE, width - 290, 84);
        ctx.fillText("Y: " + (modules[selected].y - PIDS.Y) / PIXEL_SIZE, width - 160, 84);
        ctx.fillText("W: " + modules[selected].width / PIXEL_SIZE, width - 290, 104);
        ctx.fillText("H: " + modules[selected].height / PIXEL_SIZE, width - 160, 104);
        let y = 124;
        for (const option of Object.keys(modules[selected].options)) {
            switch (option) {
                case "align":
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
                    break;
                case "color":
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
                    break;
                case "arrival":
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
                    break;
                default:
                    ctx.fillStyle = "#ffffff";
                    ctx.fillText(option[0].toUpperCase() + option.slice(1) + ": " + modules[selected].options[option], width - 290, y);
                    y += 20;
                    break;
            }
        }
        //delete button
        ctx.fillStyle = "#770000";
        ctx.fillRect(width - 290, height - 36, 280, 26);
        ctx.fillStyle = "#ff0000";
        ctx.font = "16px Consolas,'Courier New',monospace";
        ctx.textAlign = "center";
        ctx.fillText("Delete Module", width - 150, height - 30);
    }

    //draw mouse tooltip
    if (!exportMenu) {
        ctx.font = "12px Consolas,'Courier New',monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = "#00000099";
        let button = [buttons.destination, buttons.arrivalTime, buttons.trainLength, buttons.export, buttons.import, buttons.border];
        if (move.placing) {
            let dimCoords = snapToGrid(mouse.x - move.startX, mouse.y - move.startY, PIXEL_SIZE, 8);
            ctx.fillRect(mouse.x + 10, mouse.y - 5, Math.max(ctx.measureText("Placing: " + mouse.place).width, ctx.measureText(`Relative Size: ${dimCoords[0] / PIXEL_SIZE}x${dimCoords[1] / PIXEL_SIZE}`).width, ctx.measureText(`Screen Size: ${dimCoords[0]}x${dimCoords[1]}`).width) + 10, 52);
            ctx.fillStyle = "#ffffff";
            ctx.fillText("Placing: " + mouse.place, mouse.x + 15, mouse.y);
            ctx.fillText(`Relative Size: ${dimCoords[0] / PIXEL_SIZE}x${dimCoords[1] / PIXEL_SIZE}`, mouse.x + 15, mouse.y + 15);
            ctx.fillText(`Screen Size: ${dimCoords[0]}x${dimCoords[1]}`, mouse.x + 15, mouse.y + 30);
        } else if (mouse.place) {
            ctx.fillRect(mouse.x + 10, mouse.y - 5, ctx.measureText("Placing: " + mouse.place).width + 10, 22);
            ctx.fillStyle = "#ffffff";
            ctx.fillText("Placing: " + mouse.place, mouse.x + 15, mouse.y);
        } else if (pointInBox(mouse.x, mouse.y, button[0].x, button[0].y, button[0].width, button[0].height)) {
            ctx.fillRect(mouse.x + 10, mouse.y - 5, ctx.measureText("DestinationModule").width + 10, 22);
            ctx.fillStyle = "#ffffff";
            ctx.fillText("DestinationModule", mouse.x + 15, mouse.y);
        } else if (pointInBox(mouse.x, mouse.y, button[1].x, button[1].y, button[1].width, button[1].height)) {
            ctx.fillRect(mouse.x + 10, mouse.y - 5, ctx.measureText("ArrivalTimeModule").width + 10, 22);
            ctx.fillStyle = "#ffffff";
            ctx.fillText("ArrivalTimeModule", mouse.x + 15, mouse.y);
        } else if (pointInBox(mouse.x, mouse.y, button[2].x, button[2].y, button[2].width, button[2].height)) {
            ctx.fillRect(mouse.x + 10, mouse.y - 5, ctx.measureText("TrainLengthModule").width + 10, 22);
            ctx.fillStyle = "#ffffff";
            ctx.fillText("TrainLengthModule", mouse.x + 15, mouse.y);
        } else if (pointInBox(mouse.x, mouse.y, button[3].x, button[3].y, button[3].width, button[3].height)) {
            ctx.fillRect(mouse.x - 20 - ctx.measureText("Save / Export").width, mouse.y - 5, ctx.measureText("Save / Export").width + 10, 22);
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "right";
            ctx.fillText("Save / Export", mouse.x - 15, mouse.y);
        } else if (pointInBox(mouse.x, mouse.y, button[4].x, button[4].y, button[4].width, button[4].height)) {
            ctx.fillRect(mouse.x - 20 - ctx.measureText("Load / Import").width, mouse.y - 5, ctx.measureText("Load / Import").width + 10, 22);
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "right";
            ctx.fillText("Load / Import", mouse.x - 15, mouse.y);
        } else if (pointInBox(mouse.x, mouse.y, button[5].x, button[5].y, button[5].width, button[5].height)) {
            ctx.fillRect(mouse.x - 20 - ctx.measureText("Toggle Border").width, mouse.y - 5, ctx.measureText("Toggle Border").width + 10, 22);
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "right";
            ctx.fillText("Toggle Border", mouse.x - 15, mouse.y);
        }
    }

    //debug stuff
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Consolas,'Courier New',monospace";
    ctx.textAlign = "left";
    ctx.fillText("v0.1.0", 5, height - 15);
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

function pointInBox (x, y, bx, by, bw, bh) {
    return x > bx && x < bx + bw && y > by && y < by + bh;
}

function snapToGrid (x, y, size, subdiv = 1, offsetX = 0, offsetY = 0) {
    return [
        Math.round((x - offsetX) / size * subdiv) * size / subdiv + offsetX,
        Math.round((y - offsetY) / size * subdiv) * size / subdiv + offsetY
    ]
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

        if (!e.shiftKey) {
            if (e.code === "ArrowLeft") {
                modules[selected].width -= PIXEL_SIZE * 0.125;
            }
            if (e.code === "ArrowRight") {
                modules[selected].width += PIXEL_SIZE * 0.125;
            }
            if (e.code === "ArrowUp") {
                modules[selected].height -= PIXEL_SIZE * 0.125;
            }
            if (e.code === "ArrowDown") {
                modules[selected].height += PIXEL_SIZE * 0.125;
            }
        } else {
            if (e.code === "ArrowLeft") {
                modules[selected].x -= PIXEL_SIZE * 0.125;
                modules[selected].width += PIXEL_SIZE * 0.125;
            }
            if (e.code === "ArrowRight") {
                modules[selected].x += PIXEL_SIZE * 0.125;
                modules[selected].width -= PIXEL_SIZE * 0.125;
            }
            if (e.code === "ArrowUp") {
                modules[selected].y -= PIXEL_SIZE * 0.125;
                modules[selected].height += PIXEL_SIZE * 0.125;
            }
            if (e.code === "ArrowDown") {
                modules[selected].y += PIXEL_SIZE * 0.125;
                modules[selected].height -= PIXEL_SIZE * 0.125;
            }
        }
    }
});

document.addEventListener("keyup", (e) => {
    //validate export fields
    document.getElementById("exportID").value = document.getElementById("exportID").value.replace(/[^a-zA-Z0-9_]/g, "");
});

document.addEventListener("mousemove", (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
    let xMoveConstant = Math.round((mouse.x - offsetX - mouse.startX) / PIXEL_SIZE * 8) * PIXEL_SIZE / 8;
    let yMoveConstant = Math.round((mouse.y - offsetY -  mouse.startY) / PIXEL_SIZE * 8) * PIXEL_SIZE / 8;
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

document.addEventListener("mousedown", (e) => {
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
        let button = [buttons.destination, buttons.arrivalTime, buttons.trainLength, buttons.export, buttons.import, buttons.border];
        if (mouse.startY < 40) {
            if (pointInBox(mouse.startX, mouse.startY, button[0].x, button[0].y, button[0].width, button[0].height)) {
                mouse.place = "DestinationModule";
            } else if (pointInBox(mouse.startX, mouse.startY, button[1].x, button[1].y, button[1].width, button[1].height)) {
                mouse.place = "ArrivalTimeModule";
            } else if (pointInBox(mouse.startX, mouse.startY, button[2].x, button[2].y, button[2].width, button[2].height)) {
                mouse.place = "TrainLengthModule";
            } else if (pointInBox(mouse.startX, mouse.startY, button[3].x, button[3].y, button[3].width, button[3].height)) {
                exportMenu = true;
                document.getElementById("exportID").value = info.id;
                document.getElementById("exportName").value = info.name;
                document.getElementById("exportAuthor").value = info.author;
                document.getElementById("exportDescription").value = info.description;

                document.getElementById("exportMenu").style.display = "block";
            } else if (pointInBox(mouse.startX, mouse.startY, button[4].x, button[4].y, button[4].width, button[4].height)) {
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
                        let data = JSON.parse(e.target.result);
                        if (data.id) info.id = data.id;
                        if (data.name) info.name = data.name;
                        if (data.author) info.author = data.author;
                        if (data.description) info.description = data.description;
                        modules = [];
                        for (const module of data.modules) {
                            let x = module.pos.x * PIXEL_SIZE + PIDS.X;
                            let y = module.pos.y * PIXEL_SIZE + PIDS.Y;
                            let w = module.pos.w * PIXEL_SIZE;
                            let h = module.pos.h * PIXEL_SIZE;
                            switch (module.type) {
                                case "DestinationModule":
                                    modules.push(new DestinationModule(x, y, w, h, {align: module.align, color: "#" + module.color.toString(16).padStart(6, "0"), arrival: module.arrival}));
                                    break;
                                case "ArrivalTimeModule":
                                    modules.push(new ArrivalTimeModule(x, y, w, h, {align: module.align, color: "#" + module.color.toString(16).padStart(6, "0"), arrival: module.arrival}));
                                    break;
                                case "TrainLengthModule":
                                    modules.push(new TrainLengthModule(x, y, w, h, {align: module.align, color: "#" + module.color.toString(16).padStart(6, "0"), arrival: module.arrival}));
                                    break;
                            }
                        }
                    }
                });
                document.body.appendChild(fileInput);
                fileInput.click();
                } catch (e) {alert(e.stack);}
            } else if (pointInBox(mouse.startX, mouse.startY, button[5].x, button[5].y, button[5].width, button[5].height)) {
                drawBorder = !drawBorder;
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

document.addEventListener("mouseup", (e) => {
    move.moveT = false;
    move.moveB = false;
    move.moveL = false;
    move.moveR = false;
    move.moveA = false;
    mouse.pan = false;
    if (move.placing) {
        move.placing = false;
        let startCoords = snapToGrid(move.startX, move.startY, PIXEL_SIZE, 8, PIDS.X + offsetX, PIDS.Y + offsetY);
        let dimCoords = snapToGrid(mouse.x - move.startX, mouse.y - move.startY, PIXEL_SIZE, 8);
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
        switch (mouse.place) {
            case "DestinationModule":
                newModule += modules.push(new DestinationModule(startCoords[0] - offsetX, startCoords[1] - offsetY, dimCoords[0], dimCoords[1], {align: "left", color: "#ffffff", arrival: 0}));
                break;
            case "ArrivalTimeModule":
                newModule += modules.push(new ArrivalTimeModule(startCoords[0] - offsetX, startCoords[1] - offsetY, dimCoords[0], dimCoords[1], {align: "left", color: "#ffffff", arrival: 0}));
                break;
            case "TrainLengthModule":
                newModule += modules.push(new TrainLengthModule(startCoords[0] - offsetX, startCoords[1] - offsetY, dimCoords[0], dimCoords[1], {align: "left", color: "#ffffff", arrival: 0}));
                break;
        }
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