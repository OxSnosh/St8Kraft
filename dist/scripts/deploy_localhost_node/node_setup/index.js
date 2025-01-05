"use strict";
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const fund_1 = require("../functions/fund");
const node_info_1 = require("../functions/node-info");
const deploy_link_token_1 = require("../functions/deploy-link-token");
const deploy_oracle_1 = require("../functions/deploy-oracle");
const setupNode = async () => {
    // const runNodeArgs = {
    //     restartOnly: true
    // }
    // await runNode(runNodeArgs);
    let dataFromNode = await (0, node_info_1.nodeInfo)();
    console.log(dataFromNode[0]);
    console.log(dataFromNode[1]);
    const fundEthArgs = {
        nodeAddress: dataFromNode[0],
        amount: "20"
    };
    await (0, fund_1.fundEth)(fundEthArgs);
    const linkTokenAddress = await (0, deploy_link_token_1.deployLinkToken)();
    const deployOracleArgs = {
        nodeAddress: dataFromNode[0],
        linkAddress: linkTokenAddress
    };
    const oracleAddress = await (0, deploy_oracle_1.deployOracle)(deployOracleArgs);
    const jobMetadata = {
        "authToken": dataFromNode[1],
        "oracleAddress": oracleAddress,
        "nodeAddress": dataFromNode[0],
        "linkAddress": linkTokenAddress
    };
    const jsonMetadata = JSON.stringify(jobMetadata);
    const dataToWrite = `export const metadata = ${jsonMetadata};\n`;
    // Define the path
    const outputPath = path.join(__dirname, "..", "deploy_jobs", 'metadata.ts');
    // Writing to the file
    fs.writeFile(outputPath, dataToWrite, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        }
        else {
            console.log(`Data successfully written to ${outputPath}`);
        }
    });
};
setupNode();
