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
exports.relaySpyOperation = void 0;
const hardhat_1 = require("hardhat");
const defender_sdk_1 = require("@openzeppelin/defender-sdk");
const script_metadata_json_1 = require("../script-metadata.json");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
async function relaySpyOperation(data) {
    const signers = await hardhat_1.ethers.getSigners();
    const recoveredAddress = await hardhat_1.ethers.utils.recoverAddress(data.messageHash, data.signature);
    console.log(recoveredAddress);
    console.log(signers[1].address);
    let mode = "localhost";
    if (mode === "localhost") {
        if (recoveredAddress != signers[1].address) {
            throw new Error("caller of relayer not signer of message");
        }
    }
    let minterProvider;
    let signer;
    if (mode === "production") {
        let countryMinterAbi = script_metadata_json_1.HARDHAT.countryminter.ABI;
        let countryMinterAddress = script_metadata_json_1.HARDHAT.countryminter.address;
        let url = process.env.URL_FOR_RELAYER;
        minterProvider = new hardhat_1.ethers.providers.JsonRpcProvider(url);
        let minter = new hardhat_1.ethers.Contract(countryMinterAddress, countryMinterAbi, minterProvider);
        let owner = await minter.checkOwnership(data.callerNationId, recoveredAddress);
        if (!owner) {
            throw new Error("caller of relayer not signer of message production");
        }
    }
    let provider;
    if (mode === "localhost") {
        const signers = await hardhat_1.ethers.getSigners();
        let signer0PrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        provider = new hardhat_1.ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
        signer = new hardhat_1.ethers.Wallet(signer0PrivateKey, provider);
    }
    else if (mode === "production") {
        const credentials = {
            relayerApiKey: process.env.DEFENDER_API_KEY,
            realyerApiSecret: process.env.DEFENDER_API_SECRET,
        };
        let client = new defender_sdk_1.Defender(credentials);
        provider = client.relaySigner.getProvider();
        signer = await client.relaySigner.getSigner(provider, { speed: 'fast' });
    }
    let spyOperationsAbi = script_metadata_json_1.HARDHAT.spyoperationscontract.ABI;
    let spyOperationsAddress = script_metadata_json_1.HARDHAT.spyoperationscontract.address;
    const spyoperations = new hardhat_1.ethers.Contract(spyOperationsAddress, spyOperationsAbi, signer);
    var attackerSuccessScore = await spyoperations.getAttackerSuccessScore(data.callerNationId);
    var defenderSuccessScore = await spyoperations.getDefenseSuccessScore(data.defenderNationId);
    var strengthTotal = (attackerSuccessScore.toNumber() + defenderSuccessScore.toNumber());
    // console.log(attackerSuccessScore.toNumber())
    // console.log(defenderSuccessScore.toNumber())
    // console.log(strengthTotal)
    const randomNumber = Math.floor(Math.random() * strengthTotal);
    console.log(randomNumber);
    let success;
    let attackType = data.attackType;
    let attackerId;
    let defenderId = data.defenderNationId;
    let cost = 0;
    const nationStrengthAddress = script_metadata_json_1.HARDHAT.nationtrengthcontract.address;
    const nationsStrengthAbi = script_metadata_json_1.HARDHAT.nationtrengthcontract.ABI;
    const nationStrengthContract = new hardhat_1.ethers.Contract(nationStrengthAddress, nationsStrengthAbi, provider);
    let defenderStrengthRaw = await nationStrengthContract.getNationStrength(defenderId);
    let defenderStrength = defenderStrengthRaw.toNumber();
    if (attackType > 13 || attackType < 1) {
        throw new Error("attack type must be integer between 1 and 13");
    }
    if (attackType == 1) {
        cost = (100000 + defenderStrength);
    }
    else if (attackType == 2) {
        cost = (100000 + (defenderStrength * 2));
    }
    else if (attackType == 3) {
        cost = (100000 + (defenderStrength * 3));
    }
    else if (attackType == 4) {
        cost = (100000 + (defenderStrength * 3));
    }
    else if (attackType == 5) {
        cost = (100000 + (defenderStrength * 3));
    }
    else if (attackType == 6) {
        cost = (150000 + defenderStrength);
    }
    else if (attackType == 7) {
        cost = (150000 + (defenderStrength * 5));
    }
    else if (attackType == 8) {
        cost = (250000 + (defenderStrength * 2));
    }
    else if (attackType == 9) {
        cost = (300000 + (defenderStrength * 2));
    }
    else if (attackType == 10) {
        cost = (100000 + (defenderStrength * 20));
    }
    else if (attackType == 11) {
        cost = (300000 + (defenderStrength * 15));
    }
    else if (attackType == 12) {
        cost = (500000 + (defenderStrength * 5));
    }
    else if (attackType == 13) {
        cost = (500000 + (defenderStrength * 15));
    }
    if (randomNumber < attackerSuccessScore.toNumber()) {
        console.log("attackSuccess");
        success = true;
        attackerId = 0;
        defenderId = data.defenderNationId;
    }
    else {
        console.log("spy attack thwarted");
        success = false;
        attackerId = data.callerNationId;
        defenderId = data.defenderNationId;
    }
    const randomNumberForDamages = Math.floor(Math.random() * 9e13) + 1e13;
    // console.log("randomNumberForDamages", randomNumberForDamages)
    let defenderCheck = spyoperations.checkSpyOperation(defenderId, attackType);
    if (!defenderCheck) {
        throw new Error("cannot conduct spy operation of this type at this time");
    }
    await spyoperations.spyAttack(success, attackType, defenderId, attackerId, cost, randomNumberForDamages);
}
exports.relaySpyOperation = relaySpyOperation;
