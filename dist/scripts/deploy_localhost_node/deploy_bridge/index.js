"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("hello world");
const create_bridge_1 = require("../functions/create-bridge");
const deployTestBridge = async () => {
    // await createBridge(
    //     "multiply",
    //     "http://host.docker.internal:8081",
    //     "0",
    //     0
    // )
    // await createBridge(
    //     "air-battle",
    //     "http://host.docker.internal:8082",
    //     "0",
    //     0
    // )
    // await createBridge(
    //     "senate",
    //     "http://host.docker.internal:8083",
    //     "0",
    //     0
    // )
    await (0, create_bridge_1.createBridge)("ground-battle", "http://host.docker.internal:8087", "0", 0);
    await (0, create_bridge_1.createBridge)("naval-attack", "http://host.docker.internal:8088", "0", 0);
};
deployTestBridge();
