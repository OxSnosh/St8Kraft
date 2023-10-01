console.log("hello world")
import { createBridge } from "../functions/create-bridge";
import hre from "hardhat";


const deployTestBridge : any = async () => {
    
    await createBridge(
        "Test-Bridge",
        "http://localhost:8081",
        "0",
        0
    )

}

deployTestBridge()