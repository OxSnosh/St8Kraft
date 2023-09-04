console.log("hello world")

import { fundEth, fundLink } from "./functions/fund";
import { nodeInfo } from "./functions/node-info";
import { runNode } from "./functions/run-node";
import { createJob } from "./functions/create-job";
import { deployLinkToken } from "./functions/deploy-link-token";
import { deployOracle } from "./functions/deploy-oracle";
import hre from "hardhat";

const launchNode : any = async () => {

    const runNodeArgs = {
        restartOnly: true
    }

    runNode(runNodeArgs);

    const nodeAddress = await nodeInfo()
    console.log(nodeAddress)

    const fundEthArgs = {
        nodeAddress: nodeAddress,
        amount: "20"
    }

    await fundEth(fundEthArgs)

    const linkTokenAddress = await deployLinkToken()

    const deployOracleArgs = {
        nodeAddress: nodeAddress,
        linkAddress: linkTokenAddress
    }

    const oracleAddress = await deployOracle(deployOracleArgs)

    const createJobArgs = {
        contractAddress: oracleAddress,
        jobType: "direct"
    }
    
    await createJob(createJobArgs)

}

launchNode()
