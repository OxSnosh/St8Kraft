import { mergeABIs } from "hardhat-deploy/dist/src/utils";
import metadata from "../script-metadata.json"
import {ethers} from "hardhat"
import { WarBucks } from "../typechain-types";


let provider;
let signer;

async function transferSomeWarbucks() {
    const signers = await ethers.getSigners();
    let signer0PrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    signer = new ethers.Wallet(signer0PrivateKey, provider)

    let warbucksAbi = metadata.HARDHAT.warbucks.ABI
    let warbucksAddress = metadata.HARDHAT.warbucks.address

    const warbucks = new ethers.Contract(warbucksAddress, warbucksAbi, signer) as WarBucks

    // console.log(warbucks)

    await warbucks.approve(signers[0].address, BigInt(4000000*10**18));
    await warbucks.transferFrom(signers[0].address, "0xcB416A4A12d845267751AD72F31Be99BB605498B", BigInt(4000000 * 10**18))

    console.log("transfer!")
}

transferSomeWarbucks()