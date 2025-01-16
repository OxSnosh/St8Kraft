"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const run_node_1 = require("./functions/run-node");
const launchNode = async () => {
    const runNodeArgs = {
        restartOnly: false
    };
    await (0, run_node_1.runNode)(runNodeArgs);
};
launchNode();
