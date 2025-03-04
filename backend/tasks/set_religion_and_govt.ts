import { task } from "hardhat/config";
import metadata from "../script-metadata.json";
import { ethers } from "ethers";
import { CountryParametersContract } from "../typechain-types";

task("set-religion-and-govt", "Sets desired religion and government for a nation")
  .addParam("nationid", "The nation ID")
  .addParam("religion", "The first resource value")
  .addParam("government", "The second resource value")
  .setAction(async (taskArgs, hre) => {
    console.log("Task arguments:", taskArgs); // Debug log

    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    const signer0PrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const signer = new ethers.Wallet(signer0PrivateKey, provider);

    const countryParametersAbi = metadata.HARDHAT.countryparameterscontract.ABI;
    const countryParametersAddress = metadata.HARDHAT.countryparameterscontract.address;

    const parameters = new ethers.Contract(countryParametersAddress, countryParametersAbi, signer) as CountryParametersContract;

    // Check if arguments are valid numbers
    const religion = ethers.BigNumber.from(taskArgs.religion);
    const government = ethers.BigNumber.from(taskArgs.government);
    const nationId = ethers.BigNumber.from(taskArgs.nationid);

    await parameters.setDesiredReligionAndGovernmentFromOwner(nationId, religion, government);

    console.log(`Desired religion and governement for nation ${nationId} set to: ${religion}, ${government}`);
  });