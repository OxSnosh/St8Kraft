console.log("hello world")
import { createBridge } from "../functions/create-bridge";
import hre from "hardhat";


const deployTestBridge : any = async () => {
    
    // await createBridge(
    //     "multiply",
    //     "http://host.docker.internal:8081",
    //     "0",
    //     0
    // )

    // await createBridge(
    //     "air-battle",
    //     "http://host.docker.internal:8082",
    //     "0",
    //     0
    // )

    // await createBridge(
    //     "senate",
    //     "http://host.docker.internal:8083",
    //     "0",
    //     0
    // )

    await createBridge(
        "ground-battle",
        "http://host.docker.internal:8087",
        "0",
        0
    )

    await createBridge(
        "naval-attack",
        "http://host.docker.internal:8088",
        "0",
        0
    )

}

deployTestBridge()