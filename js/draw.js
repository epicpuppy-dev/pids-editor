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