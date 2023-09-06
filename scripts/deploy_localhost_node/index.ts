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

    let dataFromNode : any = await nodeInfo()
    console.log(dataFromNode[0])
    console.log(dataFromNode[1])

    const fundEthArgs = {
        nodeAddress: dataFromNode[0],
        amount: "20"
    }

    await fundEth(fundEthArgs)

    const linkTokenAddress = await deployLinkToken()

    const deployOracleArgs = {
        nodeAddress: dataFromNode[0],
        linkAddress: linkTokenAddress
    }

    const oracleAddress = await deployOracle(deployOracleArgs)

    const createJobArgs = {
        contractAddress: oracleAddress,
        jobType: "direct",
        authToken: dataFromNode[1]
    }
    
    createJob(createJobArgs)

}

launchNode()
