import { task } from "hardhat/config";
import metadata from "../script-metadata.json";
import { ethers } from "ethers";
import { ResourcesContract } from "../typechain-types";

task("set-resources", "Sets mock resources for testing")
  .addParam("nationid", "The nation ID")
  .addParam("resource1", "The first resource value")
  .addParam("resource2", "The second resource value")
  .setAction(async (taskArgs, hre) => {
    console.log("Task arguments:", taskArgs); // Debug log

    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    const signer0PrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const signer = new ethers.Wallet(signer0PrivateKey, provider);

    const resourcesAbi = metadata.HARDHAT.resourcescontract.ABI;
    const resourcesAddress = metadata.HARDHAT.resourcescontract.address;

    const resources = new ethers.Contract(resourcesAddress, resourcesAbi, signer) as ResourcesContract;

    // Check if arguments are valid numbers
    const resource1 = ethers.BigNumber.from(taskArgs.resource1);
    const resource2 = ethers.BigNumber.from(taskArgs.resource2);

    await resources.mockResourcesForTesting(0, resource1, resource2);

    console.log(`Resources set to: ${resource1}, ${resource2}`);
  });