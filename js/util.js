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