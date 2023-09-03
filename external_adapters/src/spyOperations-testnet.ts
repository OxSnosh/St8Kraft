import process from "process";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { ethers } from "ethers";
import EthCrypto from "eth-crypto";
import * as metadata from "../Contracts/contract-metadata.json";
import dotenv from "dotenv";
dotenv.config();

type EAInput = {
  id: number;
  data: {
    cipherString: string;
    randomNumber: number;
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

const PORT = process.env.PORT_SPY_OPERATION_TESTNET || 8084;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Spy Operations Running");
});

app.post("/", async function (req: Request<{}, {}, EAInput>, res: Response) {
  const eaInputData: EAInput = req.body;
  console.log(" Request data received: ", eaInputData);

  let jobRunId = eaInputData.id;

  const provider = new ethers.providers.JsonRpcProvider(/** INSERT RPC URL */);
  
  const privateKey : any = process.env.PRIVATE_KEY;
  const privateKeyString : string = privateKey.toString();
  const cipherString = eaInputData.data.cipherString;

  var cipherParsed = EthCrypto.cipher.parse(cipherString);
  console.log("cipherParsed: ", cipherParsed)
  var decrypted = await EthCrypto.decryptWithPrivateKey(
      privateKeyString, // privateKey
      cipherParsed // encrypted-data
  );
  console.log("decrypted: ", decrypted)

  const parsedDecyptedMessage = JSON.parse(decrypted)
  console.log("parsedDecyptedMessage: ", parsedDecyptedMessage)

  var signerAddress = await ethers.utils.verifyMessage(JSON.stringify(parsedDecyptedMessage.nationId), parsedDecyptedMessage.signature)
  console.log("attackerAddress: ", signerAddress)

  var nationId = parsedDecyptedMessage.nationId.nationId
  console.log("nationId: ", nationId)

  const countryMinterAddress = metadata.HARDHAT.countryminter.address;
  const countryMinterAbi = metadata.HARDHAT.countryminter.ABI;
  const countryMinterContract = new ethers.Contract(countryMinterAddress, countryMinterAbi);

  const forcesContractAddress = metadata.HARDHAT.forcescontract.address;
  const forcesContractAbi = metadata.HARDHAT.forcescontract.ABI;
  const forcesContract = new ethers.Contract(forcesContractAddress, forcesContractAbi);

  var isOwner = await countryMinterContract.checkOwnership(nationId, signerAddress)
  console.log("isOwner: ", isOwner);
  var spies = await forcesContract.getSpyCount(nationId);
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