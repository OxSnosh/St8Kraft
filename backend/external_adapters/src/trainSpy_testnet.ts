import process from "process";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { ethers } from "ethers";
import EthCrypto from "eth-crypto";
import * as metadata from "../Contracts/contract-metadata.json";
import dotenv from "dotenv";
import { mnemonicToEntropy } from "ethers/lib/utils";
dotenv.config();

type EAInput = {
  id: number;
  data: {
    cipherString: string;
    attackId: number;
    msgSender: string;
  };
};

type EAOutput = {
  jobRunId: string | number;
  statusCode: number;
  data: {
    attackId: number
    trainedSpyToken: string;
  };
  error?: string;
};

const PORT = process.env.PORT_TRAIN_SPY_TESTNET || 8085;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Spy Operations Running");
});

app.post("/", async function (req: Request<{}, {}, EAInput>, res: Response) {
  const eaInputData: EAInput = req.body;
  console.log(" Request data received: ", eaInputData);

  let jobRunId = eaInputData.id;
  const cipherString = eaInputData.data.cipherString;

  const provider = new ethers.providers.JsonRpcProvider(/** INSERT RPC URL */);
  
  const privateKey : any = process.env.PRIVATE_KEY;
  const privateKeyString : string = privateKey.toString();

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

  var attackerId = parsedDecyptedMessage.package.attackerId
  var defenderId = parsedDecyptedMessage.package.defenderId
  var attackType = parsedDecyptedMessage.package.attackType
  
  const countryMinterAddress = metadata.TESTNET.countryminter.address;
  const countryMinterAbi = metadata.TESTNET.countryminter.ABI;
  const countryMinterContract = new ethers.Contract(countryMinterAddress, countryMinterAbi);

  const forcesContractAddress = metadata.TESTNET.forcescontract.address;
  const forcesContractAbi = metadata.TESTNET.forcescontract.ABI;
  const forcesContract = new ethers.Contract(forcesContractAddress, forcesContractAbi);

  const nationStrengthAddress = metadata.TESTNET.nationstrengthcontract.address;
  const nationsStrengthAbi = metadata.TESTNET.nationstrengthcontract.ABI;
  const nationStrengthContract = new ethers.Contract(nationStrengthAddress, nationsStrengthAbi)

  const treasuryContractAddress = metadata.TESTNET.treasurycontract.address
  const treasuryContractAbi = metadata.TESTNET.treasurycontract.ABI
  const treasuryContract = new ethers.Contract(treasuryContractAddress, treasuryContractAbi)

  var defenderStrength = await nationStrengthContract.getNationSrength(defenderId);

  var cost;

  if (attackType == 1) {
    cost = (100000 + defenderStrength)
  } else if (attackType == 2) {
    cost = (100000 + (defenderStrength * 2))
  } else if (attackType == 3) {
    cost = (100000 + (defenderStrength * 3))
  } else if (attackType == 4) {
    cost = (100000 + (defenderStrength * 3))
  } else if (attackType == 5) {
    cost = (100000 + (defenderStrength * 3))
  } else if (attackType == 6) {
    cost = (150000 + defenderStrength)
  } else if (attackType == 7) {
    cost = (150000 + (defenderStrength * 5))
  } else if (attackType == 8) {
    cost = (250000 + (defenderStrength * 2))
  } else if (attackType == 9) {
    cost = (300000 + (defenderStrength * 2))
  } else if (attackType == 10) {
    cost = (100000 + (defenderStrength * 20))
  } else if (attackType == 11) {
    cost = (300000 + (defenderStrength * 15))
  } else if (attackType == 12) {
    cost = (500000 + (defenderStrength * 5))
  } else if (attackType == 13) {
    cost = (500000 + (defenderStrength * 15))
  }

  let attackerBalance = treasuryContract.checkBalance(attackerId);

  var isOwner = await countryMinterContract.checkOwnership(attackerId, signerAddress)
  console.log("isOwner: ", isOwner);

  var spies = await forcesContract.getSpyCount(attackerId);
  var spyCount = spies.toNumber();
  console.log("spies: ", spyCount);

  let moneyAvailable = false;

  if (attackerBalance >= cost) {
    moneyAvailable = true;
  }

  if(moneyAvailable && spyCount >= 1 && isOwner) {
     await treasuryContract.spendBalance(attackerId, cost)
  }

  let attackIdString : string = JSON.stringify(eaInputData.data.attackId)

  const message = {
    "defenderId" : defenderId,
    "attackerId" : attackerId,
    "attackType" : attackType,
    "attackId" : attackIdString
  }
  const messageString = JSON.stringify(message);
  const publicKeyForReencryption = JSON.stringify(process.env.PUBLIC_KEY_FOR_REENCRYPTION)

  const encrypted = await EthCrypto.encryptWithPublicKey(
    publicKeyForReencryption,
    messageString
  )

  const trainedSpyToken = EthCrypto.cipher.stringify(encrypted)
  const attackId = eaInputData.data.attackId
  
  let eaResponse: EAOutput = {
    data: {
      attackId,
      trainedSpyToken,
    },
    jobRunId: eaInputData.id,
    statusCode: 0,
  };

  try {
    eaResponse.jobRunId = jobRunId;
    eaResponse.data.attackId = attackId;
    eaResponse.data.trainedSpyToken = trainedSpyToken;
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