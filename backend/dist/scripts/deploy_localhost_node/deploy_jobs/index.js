"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("hello world");
const create_job_1 = require("./src/create-job");
const metadata_1 = require("./metadata");
const deployTestJob = async () => {
    const createJobArgs = {
        oracleAddress: metadata_1.metadata.oracleAddress,
        jobType: "direct",
        authToken: metadata_1.metadata.authToken
    };
    (0, create_job_1.createJob)(createJobArgs);
};
deployTestJob();
// const deployAirBattleJob : any = async () => {
//     console.log(metadata)
//     const createJobArgs = {
//         oracleAddress: metadata.oracleAddress,
//         jobType: "direct",
//         authToken: metadata.authToken
//     }
//     createAirBattleJob(createJobArgs)
// }
// deployAirBattleJob()
