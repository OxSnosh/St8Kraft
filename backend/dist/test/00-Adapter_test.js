"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//St8kraft © 2022 by OxSnosh is licensed under Attribution-NonCommercial-NoDerivatives 4.0 International
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
const metadata_1 = require("../scripts/deploy_localhost_node/deploy_jobs/metadata");
const jobMetadata_1 = require("../scripts/deploy_localhost_node/deploy_jobs/jobMetadata");
// import operatorArtifact from "../artifacts/contracts/tests/Operator.sol/Operator.json";
// import OracleArtifact from "../artifacts/@chainlink/contracts/src/v0.4/Oracle.sol/Oracle.json";
const LinkToken_json_1 = __importDefault(require("../artifacts/@chainlink/contracts/src/v0.4/LinkToken.sol/LinkToken.json"));
describe("Adapter Test", function () {
    // const oracleAbi = OracleArtifact.abi;
    // const linkTokenAbi = LinkTokenArtifact.abi;
    let testContract;
    let signer0;
    let signer1;
    let signer2;
    let signers;
    let linkToken;
    beforeEach(async function () {
        console.log("hello world");
        signers = await hardhat_1.ethers.getSigners();
        signer0 = signers[0];
        signer1 = signers[1];
        signer2 = signers[2];
        // const LinkToken  = await ethers.getContractFactory(
        //         "LinkToken"
        // )
        // let linkToken = await LinkToken.connect(signer0).deploy() as LinkToken
        // await linkToken.deployed()
        // const linkToken = new ethers.Contract(metadata.linkAddress, linkTokenAbi, signer0) as LinkToken;
        console.log("is this the place 0");
        const contractABI = LinkToken_json_1.default.abi;
        // console.log(contractABI)
        const provider = new hardhat_1.ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
        // const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545/");
        for (let i = 0; i < 50; i++) {
            await hardhat_1.network.provider.send("evm_mine");
        }
        const contractAddress = metadata_1.metadata.linkAddress;
        linkToken = new hardhat_1.ethers.Contract(contractAddress, contractABI, provider);
        // const linkToken = await ethers.getContractAt("LinkToken", metadata.linkAddress) as LinkToken
        // UNCOMMENT FROM HERE
        console.log("is this the place 1");
        console.log("address from metadata", metadata_1.metadata.linkAddress);
        console.log("address from test", linkToken.address);
        const TestContract = await hardhat_1.ethers.getContractFactory("Test");
        testContract = await TestContract.deploy();
        await testContract.deployed();
        console.log("isseus");
        console.log(linkToken.address, "LINK token");
        // console.log(linkToken, "LINK")
        console.log("more issues");
        await linkToken.connect(signer0).transfer(testContract.address, BigInt(10000000000000000000));
        const linkBalanceTestContract = await linkToken.balanceOf(testContract.address);
        console.log("Test contract LINK Balance:", Number(linkBalanceTestContract));
        await linkToken.connect(signer0).transfer(signer0.address, BigInt(10000000000000000000));
        const linkBalanceSigner0 = await linkToken.balanceOf(signer0.address);
        console.log("Signer0 LINK Balance:", Number(linkBalanceSigner0));
        const nodeAddress = metadata_1.metadata.nodeAddress;
        await linkToken.connect(signer0).transfer(nodeAddress, BigInt(15000000000000000000));
        const linkBalanceNode = await linkToken.balanceOf(nodeAddress);
        console.log("Node LINK Balance:", Number(linkBalanceNode));
        const operatorAddress = metadata_1.metadata.oracleAddress;
        await linkToken.connect(signer0).transfer(operatorAddress, BigInt(25000000000000000000));
        const linkBalanceOperator = await linkToken.balanceOf(operatorAddress);
        console.log("Operator LINK Balance:", Number(linkBalanceOperator));
        // await linkToken.transferFrom(signer0.address, testContract.address, BigInt(1000000000000000000000))
        console.log("oracle address", metadata_1.metadata.oracleAddress);
        const jobIdToRaw = jobMetadata_1.jobId;
        const jobIdWithoutHyphens = jobIdToRaw.replace(/-/g, "");
        console.log("JobId", jobIdWithoutHyphens);
        // const jobIdBytes = ethers.utils.toUtf8Bytes(jobIdWithoutHyphens)
        // console.log(jobIdBytes);
        const jobIdString = jobIdWithoutHyphens.toString();
        const jobIdBytes = hardhat_1.ethers.utils.hexlify(hardhat_1.ethers.utils.toUtf8Bytes(jobIdString));
        await testContract.updateLinkAddress(metadata_1.metadata.linkAddress);
        await testContract.updateOracleAddress(metadata_1.metadata.oracleAddress);
        await testContract.updateJobId(jobIdBytes);
        await testContract.updateFee(BigInt(1000000000000000000));
        console.log("maybe end of before each");
    });
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const eventPromise = new Promise((resolve, reject) => {
        testContract.once("CallbackCompleted", (product) => {
            try {
                (0, chai_1.expect)(product).to.equal(5000);
                resolve(product);
            }
            catch (error) {
                reject(error);
            }
        });
    });
    describe("External Adapter", function () {
        it("Should send a request to the node", async function () {
            testContract.multiplyBy1000(5);
            // await expect(testContract.multiplyBy1000(5)).to.emit(testContract, "CallbackCompleted").withArgs(5000);
            // console.log("waiting 3 seconds");
            // await delay(3000);
            // console.log("3 seconds passed");
            // await network.provider.send("evm_mine")
            // console.log("block mined");
            // const eventResult = await eventPromise;
            // console.log("CallbackCompleted event emitted")
            // const eventFilter1 = testContract.filters.CallbackCompleted();
            // const event1Logs = await testContract.queryFilter(eventFilter1);
            // console.log(event1Logs);
            const productUpdated = await testContract.getProduct();
            console.log(productUpdated.toNumber());
        });
    });
});
