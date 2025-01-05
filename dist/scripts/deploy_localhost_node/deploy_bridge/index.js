"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("hello world");
const create_bridge_1 = require("../functions/create-bridge");
const deployTestBridge = async () => {
    await (0, create_bridge_1.createBridge)("multiply", "http://host.docker.internal:8081", "0", 0);
    await (0, create_bridge_1.createBridge)("air-battle", "http://host.docker.internal:8082", "0", 0);
};
deployTestBridge();
