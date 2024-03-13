const fs = require("fs");

const file = fs.readFileSync("src/resources/font/Minecraft-Regular.woff2");

fs.writeFileSync("out.txt", 'data:font/woff2;base64,' + file.toString("base64"));