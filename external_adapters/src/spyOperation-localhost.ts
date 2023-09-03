import process from "process";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { ethers } from "ethers";
import * as metadata from "../Contracts/contract-metadata.json";
import dotenv from "dotenv";
dotenv.config();

type EAInput = {
  id: number;
  data: {
    owner: number;
    attackType: number;
  };
};

type EAOutput = {
  jobRunId: string | number;
  statusCode: number;
  data: {
    spies: number;
  };
  error?: string;
};

const PORT = process.env.PORT_SPY_OPERATION || 8083;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Spy Operations Running");
});

app.post("/", async function (req: Request<{}, {}, EAInput>, res: Response) {
  const eaInputData: EAInput = req.body;
  console.log(" Request data received: ", eaInputData);

  let jobRunId = eaInputData.id;

  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

  const signer0 = provider.getSigner(0)
  const signer1 = provider.getSigner(1)
  const signer1Address = await signer1.getAddress();
  // const signer2 = provider.getSigner(2)


  const countryMinterAddress = metadata.HARDHAT.countryminter.address;
  const countryMinterAbi = metadata.HARDHAT.countryminter.ABI;
  const countryMinterContract = new ethers.Contract(countryMinterAddress, countryMinterAbi, signer0);

  const forcesContractAddress = metadata.HARDHAT.forcescontract.address;
  const forcesContractAbi = metadata.HARDHAT.forcescontract.ABI;
  const forcesContract = new ethers.Contract(forcesContractAddress, forcesContractAbi, signer0);

  var isOwner = await countryMinterContract.checkOwnership(0, signer1Address)
  console.log("isOwner: ", isOwner);
  var spies = await forcesContract.getSpyCount(0);
  var spyCount = spies.toNumber();
  console.log("spies: ", spyCount);
  
  let eaResponse: EAOutput = {
    data: {
      spies,
    },
    jobRunId: eaInputData.id,
    statusCode: 0,
  };

  try {
    eaResponse.jobRunId = jobRunId;
    eaResponse.data.spies = spyCount;
    eaResponse.statusCode = 200;
    res.json(eaResponse);
  } catch (error: any) {
    console.error(error);
    eaResponse.error = error.message;
    eaResponse.statusCode = 400;
    res.json(eaResponse);
  }

  console.log("returned response:  ", eaResponse);
  return;
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.info("\nShutting down server...");
  process.exit(0);
});