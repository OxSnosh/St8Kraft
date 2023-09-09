console.log("hello world")
import { createJob } from "../functions/create-job";
import hre from "hardhat";
import { metadata } from "./metadata";

const deployTestJob : any = async () => {

    const createJobArgs = {
        oracleAddress: metadata.oracleAddress,
        jobType: "direct",
        authToken: metadata.authToken
    }
    
    createJob(createJobArgs)

}

deployTestJob()