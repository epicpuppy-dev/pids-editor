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