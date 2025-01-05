"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployLinkToken = void 0;
const hardhat_1 = __importDefault(require("hardhat"));
const LinkToken_json_1 = __importDefault(require("../../../artifacts/@chainlink/contracts/src/v0.4/LinkToken.sol/LinkToken.json"));
const deployLinkToken = async () => {
    const LinkToken = await hardhat_1.default.ethers.getContractFactoryFromArtifact(LinkToken_json_1.default);
    const linkToken = await LinkToken.deploy();
    await linkToken.deployed();
    console.table({ "Link Token Address": linkToken.address });
    return linkToken.address;
};
exports.deployLinkToken = deployLinkToken;
