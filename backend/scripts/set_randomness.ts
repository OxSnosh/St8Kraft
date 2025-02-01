

import metadata from "../script-metadata.json"
import {ethers} from "hardhat"
import { ResourcesContract } from "../typechain-types";
import { task } from 'hardhat/config';

let provider;
let signer;

async function setResources(taskArguments: any) {
    const signers = await ethers.getSigners();
    let signer0PrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    signer = new ethers.Wallet(signer0PrivateKey, provider)

    let resourcesAbi = metadata.HARDHAT.warbucks.ABI
    let resourcesAddress = metadata.HARDHAT.warbucks.address

    const resources = new ethers.Contract(resourcesAddress, resourcesAbi, signer) as ResourcesContract

    // console.log(warbucks)

    await resources.mockResourcesForTesting(0, taskArguments[0], taskArguments[1])

    console.log("resources set")
}

setResources()