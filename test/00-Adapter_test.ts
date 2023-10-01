import { expect } from "chai"
import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { INITIAL_SUPPLY } from "../helper-hardhat-config"
import { Test, Oracle } from "../typechain-types"
import { LinkToken } from '../typechain-types/@chainlink/contracts/src/v0.4/LinkToken';
import { link } from "fs"
import { metadata } from "../scripts/deploy_localhost_node/deploy_jobs/metadata";
import { jobId } from "../scripts/deploy_localhost_node/deploy_jobs/jobMetadata";
// import operatorArtifact from "../artifacts/contracts/tests/Operator.sol/Operator.json";
import OracleArtifact from "../artifacts/@chainlink/contracts/src/v0.4/Oracle.sol/Oracle.json";


describe("Adapter Test", function () {
  
  const oracleAbi = OracleArtifact.abi;

  let testContract: Test

  let signer0: SignerWithAddress
  let signer1: SignerWithAddress
  let signer2: SignerWithAddress
  let signers: SignerWithAddress[]

  beforeEach(async function () {

    signers = await ethers.getSigners();
    signer0 = signers[0];
    signer1 = signers[1];
    signer2 = signers[2];

    const LinkToken  = await ethers.getContractFactory(
            "LinkToken"
    )
    let linkToken = await LinkToken.deploy() as LinkToken
        await linkToken.deployed()

    const TestContract = await ethers.getContractFactory(
        "Test"
    )
    testContract = await TestContract.deploy() as Test
    await testContract.deployed()

    await linkToken.transfer(testContract.address, BigInt(100000000000000000000))

    await testContract.updateOracleAddress(metadata.oracleAddress)

    const jobIdToRaw : any = jobId

    const jobIdWithoutHyphens = jobIdToRaw.replace(/-/g, "");
    console.log(jobIdWithoutHyphens);

    const jobIdBytes = ethers.utils.toUtf8Bytes(jobIdWithoutHyphens)
    console.log(jobIdBytes);

    await testContract.updateJobId(jobIdBytes)

  });

  describe("External Adapter", function () {
    it("Should send a request to the node", async function () {
        await testContract.connect(signer0).multiplyBy1000(5);
    });
  });
});