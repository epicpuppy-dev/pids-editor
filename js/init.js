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

const VERSION = "0.2.3";

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