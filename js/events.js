//event listeners
function keyDown (e) {
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
}

function keyUp (e) {
    //validate export fields
    document.getElementById("exportID").value = document.getElementById("exportID").value.replace(/[^a-zA-Z0-9_]/g, "");
}

function mouseMove (e) {
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
}

function mouseDown (e) {
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
}

function mouseUp (e) {
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
}

//export menu buttons
function exportCancel () {
    exportMenu = false;
    document.getElementById("exportMenu").style.display = "none";

}

function exportClick () {
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
}