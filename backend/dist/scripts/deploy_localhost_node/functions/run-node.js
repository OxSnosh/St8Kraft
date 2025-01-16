"use strict";
// import * as compose from "docker-compose";
// import { ActionType, HardhatUserConfig } from 'hardhat/types';
// import { join } from "path";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runNode = void 0;
// export const runNode = async () => {
//   try {
//     await compose.down({ cwd: __dirname, log: true });
//     await compose.upAll({ cwd: __dirname, log: true });
//     console.log("Node running");
//   } catch (e) {
//     console.log("Encountered errors when trying to run node");
//     console.error(e);
//   }
// };
const compose = __importStar(require("docker-compose"));
const path_1 = require("path");
const runNode = async (taskArgs) => {
    const { restartOnly } = taskArgs;
    try {
        if (restartOnly) {
            await compose.restartAll({ cwd: (0, path_1.join)(__dirname), log: true });
        }
        else {
            await compose.down({ cwd: (0, path_1.join)(__dirname), log: true });
            await compose.upAll({ cwd: (0, path_1.join)(__dirname), log: true });
        }
        console.log("Node running");
    }
    catch (e) {
        console.log("Encountered errors when trying to run node");
        console.error(e);
    }
};
exports.runNode = runNode;
