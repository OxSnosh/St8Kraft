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
    defenderIdOfRequest: number;
    encryptedAttackerIdOfRequest: string;
    randomNumber: number;
    token: string;
    randomnessRequestId: number;
  };
};

type EAOutput = {
  jobRunId: string | number;
  statusCode: number;
  data: {
    success: boolean
    attackId: number
    revealedAttackerId: number;
    defenderId: number;
    attackType: number;
    randomnessRequestId: number;
    validAttack: boolean;
  };
  error?: string;
};

const PORT = process.env.EXECUTE_SPY_OPERATION_TESTNET || 8086;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Spy Operations Running");
});

app.post("/", async function (req: Request<{}, {}, EAInput>, res: Response) {
  const eaInputData: EAInput = req.body;
  console.log(" Request data received: ", eaInputData);

  let jobRunId = eaInputData.id;
  const cipherString = eaInputData.data.token;

  let randomnessRequestId : number = eaInputData.data.randomnessRequestId

  const provider = new ethers.providers.JsonRpcProvider(/*'http://127.0.0.1:8545/'*/);
  
  const privateKey : any = process.env.PRIVATE_KEY_FOR_REENCRYPTION;
  const privateKeyString : string = privateKey.toString();

  var cipherParsed = EthCrypto.cipher.parse(cipherString);
  console.log("cipherParsed: ", cipherParsed)
  var decryptedToken = await EthCrypto.decryptWithPrivateKey(
      privateKeyString, // privateKey
      cipherParsed // encrypted-data
  );
  console.log("decrypted: ", decryptedToken)

  const parsedDecyptedToken = JSON.parse(decryptedToken)
  console.log("parsedDecyptedMessage: ", parsedDecyptedToken)

  var encryptedAttackerString = eaInputData.data.encryptedAttackerIdOfRequest
  var attackerStringParsed = EthCrypto.cipher.parse(encryptedAttackerString)
  var decryptedAttackerId = await EthCrypto.decryptWithPrivateKey(
    privateKeyString,
    attackerStringParsed
  )

  var defenderIdFromRequest = eaInputData.data.defenderIdOfRequest

  var attackerIdFromToken = parsedDecyptedToken.package.attackerId
  var defenderIdFromToken = parsedDecyptedToken.package.defenderId
  var attackType = parsedDecyptedToken.package.attackType
  var attackIdFromToken = parsedDecyptedToken.package.attackId

  var randomNumber = eaInputData.data.randomNumber
  
  const spyOperationContractAddress = metadata.TESTNET.spyoperationcontract.address
  const spyOperationContractAbi = metadata.TESTNET.spyoperationcontract.ABI
  const spyOperationContract = new ethers.Contract(spyOperationContractAddress, spyOperationContractAbi)

  const forcesContractAddress = metadata.TESTNET.forcescontract.address;
  const forcesContractAbi = metadata.TESTNET.forcescontract.ABI;
  const forcesContract = new ethers.Contract(forcesContractAddress, forcesContractAbi);

  let spies = 0

  let validAttack; 

  if (attackerIdFromToken == decryptedAttackerId) {
    let spyCount : any = await forcesContract.getSpyCount(attackerIdFromToken);
    spies = spyCount.toNumber();
  } else {
    validAttack = false;
  }

  let attackerSpyAttackStrength;
  let defenderSpyAttackStrength;
  let success = false
  let revealedAttackerId

  if (spies >= 1 && defenderIdFromRequest == defenderIdFromToken) {
    validAttack = true
    attackerSpyAttackStrength = await spyOperationContract.getAttackerSuccessScore(attackerIdFromToken)
    defenderSpyAttackStrength = await spyOperationContract.getDefenderSuccessScore(defenderIdFromToken)

    let totalStrength = attackerSpyAttackStrength + defenderSpyAttackStrength;

    let successSelector = randomNumber % totalStrength;

    if (successSelector < attackerSpyAttackStrength) {
        success = true
        revealedAttackerId = 0
    } else {
        success = false
        revealedAttackerId = attackerIdFromToken
    }
  } else {
    validAttack = false
  }

  let attackId = JSON.parse(attackIdFromToken)

  let defenderId = defenderIdFromToken
  
  let eaResponse: EAOutput = {
    data: {
      success,
      attackId,
      revealedAttackerId,
      defenderId,
      attackType,
      randomnessRequestId,
      validAttack
    },
    jobRunId: eaInputData.id,
    statusCode: 0,
  };

  try {
    eaResponse.jobRunId = jobRunId;
    eaResponse.data.success = success;
    eaResponse.data.attackId = attackId;
    eaResponse.data.revealedAttackerId = revealedAttackerId;
    eaResponse.data.defenderId = defenderId;
    eaResponse.data.attackType = attackType;
    eaResponse.data.randomnessRequestId = randomnessRequestId;
    eaResponse.data.validAttack = validAttack;
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