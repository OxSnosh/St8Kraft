"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployOracle = void 0;
const hardhat_1 = __importDefault(require("hardhat"));
const Operator_json_1 = __importDefault(require("../../../artifacts/contracts/tests/Operator.sol/Operator.json"));
const deployOracle = async (taskArgs) => {
    const { nodeAddress, linkAddress } = taskArgs;
    const signers = await hardhat_1.default.ethers.getSigners();
    const signer0 = signers[0];
    const Operator = await hardhat_1.default.ethers.getContractFactoryFromArtifact(Operator_json_1.default);
    const operator = await Operator.deploy(linkAddress, signer0.address);
    await operator.deployed();
    const arr = [];
    arr.push(nodeAddress);
    // Set Fulfillment on Oracle
    await operator.setAuthorizedSenders(arr);
    console.log("All set on this end! If you've setup everything correctly, you can start getting external data from your smart contract");
    console.table({ "Oracle Address": operator.address });
    return operator.address;
};
exports.deployOracle = deployOracle;
