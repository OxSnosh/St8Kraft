import process from "process";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { ethers } from "ethers";
dotenv.config();

type EAInput = {
  id: number;
  data: {
    attackerBombers : string
    attackerFighters : string
    attackerId : number
    defenderFighters : string
    defenderId : number
    attackId : number
    randomNumbers : string
  }
};

type EAOutput = {
  jobRunId: string | number;
  statusCode: number;
  data: {
    attackerFighterCasualties?: string;
    attackerBomberCasualties?: string;
    defenderFighterCasualties?: string;
    attackerId?: number;
    defenderId?: number;
    infrastructureDamage?: number;
    tankDamage?: number;
    cruiseMissileDamage?: number;
    battleId?: number;
  };
  error?: string;
};

const PORT = 8082;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Air Battle Running");
});

app.post("/", async function (req: Request<{}, {}, EAInput>, res: Response) {
    const eaInputData: EAInput = req.body;
    console.log(" Request data received: ", eaInputData);

    console.log("and so it begins");

    function decodeBase64ToUint8Array(base64String: string, length: number): Uint8Array {
      // Decode Base64 string to a Buffer
      const buffer = Buffer.from(base64String, 'base64');
  
      // Convert Buffer to Uint8Array
      const uint8Array = new Uint8Array(buffer);
  
      // Ensure the Uint8Array has at least the desired length
      if (uint8Array.length < length) {
          throw new Error(`Decoded data is shorter than the specified length: ${length}`);
      }
  
      // Return the array truncated to the specified length
      return uint8Array.slice(-length);
    }

    function decodeBase64ToUint256Array(base64String: string) {
      // Decode Base64 string into a Buffer
      const buffer = Buffer.from(base64String, 'base64');
  
      // Ensure the buffer length is divisible by 32 (256 bits per integer)
      const uint256Size = 32; // 256 bits = 32 bytes
      if (buffer.length % uint256Size !== 0) {
          throw new Error("Invalid Base64 string: Buffer length must be a multiple of 32.");
      }
  
      // Convert the buffer into an array of 256-bit unsigned integers
      const uint256Array = [];
      for (let i = 0; i < buffer.length; i += uint256Size) {
          const chunk = buffer.subarray(i, i + uint256Size); // Extract 32-byte chunk
          const bigIntValue = BigInt(`0x${chunk.toString('hex')}`); // Convert to BigInt
          uint256Array.push(bigIntValue);
      }
  
      return uint256Array;
    }

    let jobRunId = eaInputData.id;
    const defenderFightersArrBase64 = eaInputData.data.defenderFighters;
    console.log("defenderFighterArray", defenderFightersArrBase64)
    const defenderFightersArr = decodeBase64ToUint8Array(defenderFightersArrBase64, 9)
    console.log(defenderFightersArr)
    const attackerFightersArrBase64 = eaInputData.data.attackerFighters;
    const attackerFightersArr = decodeBase64ToUint8Array(attackerFightersArrBase64, 9)
    console.log("attackerFightersArr", attackerFightersArr)
    const attackerBombersArrBase64 = eaInputData.data.attackerBombers;
    const attackerBombersArr = decodeBase64ToUint8Array(attackerBombersArrBase64, 9)
    console.log("attackerBombersArr", attackerBombersArr)
    let randomNumbers = decodeBase64ToUint256Array(eaInputData.data.randomNumbers)
    console.log("random numbers", randomNumbers)

    let defenderBattleArray = []
    let i = 0
    let currentIndex = defenderFightersArr.length - 1

    while (defenderBattleArray.length < 25 && currentIndex >= 0) {
    if (defenderFightersArr[currentIndex] === 0) {
        currentIndex--
    }
    if (defenderFightersArr[currentIndex] > 0) {
        defenderBattleArray[i] = currentIndex + 1
        defenderFightersArr[currentIndex]--
        i++
    }
    if (currentIndex < 0) {
        break
    }
    }
    console.log(defenderBattleArray, "defenderBattleArray")

    let attackerBattleArray = []
    let j = 0;
    let currentIndex2 = attackerFightersArr.length - 1;

    while (attackerBattleArray.length < 25 && currentIndex2 >= 0) {
    if (attackerFightersArr[currentIndex2] === 0) {
        currentIndex2--
    }
    if (attackerFightersArr[currentIndex2] > 0) {
        attackerBattleArray[j] = currentIndex2 + 1
        attackerFightersArr[currentIndex2]--
        j++
    }
    if (currentIndex2 < 0) {
        break
    }
    }
    console.log(attackerBattleArray, "attackerBattleArray")

    let attackerBomberBattleArray = []
    let x = 0
    let currentIndex3 = attackerBombersArr.length - 1

    while (attackerBomberBattleArray.length < 25 && currentIndex3 >= 0) {
    if (attackerBombersArr[currentIndex3] === 0) {
        currentIndex3--
    }
    if (attackerBombersArr[currentIndex3] > 0) {
        attackerBomberBattleArray[x] = currentIndex3 + 1
        attackerBombersArr[currentIndex3]--
        x++
    }
    if (currentIndex3 < 0) {
        break
    }
    }
    console.log(attackerBomberBattleArray, "attackerBomberBattleArray")

    let defenderFightersInvolved = 0
    let attackerFightersInvolved = 0

    for (let k = 0; k < defenderBattleArray.length; k++) {
    if (defenderBattleArray[k] > 0) {
        defenderFightersInvolved += 1
    }
    }
    for (let l = 0; l < attackerBattleArray.length; l++) {
    if (attackerBattleArray[l] > 0) {
        attackerFightersInvolved += 1
    }
    }

    let totalFighersInvolved = defenderFightersInvolved + attackerFightersInvolved
    let casualties = Math.round(totalFighersInvolved * 0.3)
    console.log(casualties, "casualties")

    //calculate attacker fighter strength
    let attackerFighterStrength = 0
    for (let m = 0; m < attackerBattleArray.length; m++) {
    attackerFighterStrength += attackerBattleArray[m]
    }
    console.log(attackerFighterStrength, "attackerFighterStrength")
    let defenderFighterStrength = 0
    for (let n = 0; n < defenderBattleArray.length; n++) {
    defenderFighterStrength += defenderBattleArray[n]
    }
    console.log(defenderFighterStrength, "defenderFighterStrength")

    let totalStrength = attackerFighterStrength + defenderFighterStrength
    console.log(totalStrength, "totalStrength")

    let attackerBomberStrength = 0
    for (let y = 0; y < attackerBomberBattleArray.length; y++) {
    attackerBomberStrength += attackerBomberBattleArray[y]
    }
    console.log(attackerBomberStrength, "attackerBomberStrength")

    let numbers = []

    for (let i = 0; i < 50; i += 10) {
    const number = randomNumbers[2].toString().substring(i, i + 10)
    numbers.push(Number(number))
    }
    for (let i = 0; i < 50; i += 10) {
    const number = randomNumbers[3].toString().substring(i, i + 10)
    numbers.push(Number(number))
    }
    for (let i = 0; i < 50; i += 10) {
    const number = randomNumbers[4].toString().substring(i, i + 10)
    numbers.push(Number(number))
    }
    for (let i = 0; i < 50; i += 10) {
    const number = randomNumbers[5].toString().substring(i, i + 10)
    numbers.push(Number(number))
    }
    for (let i = 0; i < 50; i += 10) {
    const number = randomNumbers[6].toString().substring(i, i + 10)
    numbers.push(Number(number))
    }

    let attackerFighterCasualties = []
    let attackerBomberCasualties = []
    let defenderFighterCasualties = []
    let bomberDamage = 0

    for (let o = 0; o <= casualties; o++) {
    console.log(`dogfight ${o}`)
    var randomNumner = numbers[o]
    console.log(randomNumner, "randomNumner")
    var randomModulus = randomNumner % totalStrength
    console.log(randomModulus, "randomModulus")
    if (randomModulus < attackerFighterStrength) {
        console.log("attacker wins")
        //an attacker victory will result in a defender plane being lost and bomber damage inflicted (if bombers are present)
        var randomIndex = Math.floor(Math.random() * defenderFightersInvolved)
        if (defenderFightersInvolved = 0) {
          console.log("bombing")
        } else if (defenderFightersInvolved >= 1) {
          console.log(randomIndex, "randomIndex")
          console.log(defenderBattleArray[randomIndex], "type of defender fighter lost")
          defenderFighterCasualties.push(defenderBattleArray[randomIndex])
          if(defenderFighterStrength >= defenderBattleArray[randomIndex]) {
            defenderFighterStrength -= defenderBattleArray[randomIndex]
          } else if (defenderFighterStrength < defenderBattleArray[randomIndex]) {
            defenderFighterStrength = 0
          }
          totalStrength -= defenderBattleArray[randomIndex]
          defenderBattleArray[randomIndex] = 0
          console.log(defenderBattleArray, "defenderBattleArray")
          defenderBattleArray.splice(randomIndex, 1)
          defenderFightersInvolved -= 1
        }
        console.log(defenderFighterStrength, "new defenderFighterStrength")
        console.log(totalStrength, "new totalStrength")
        // defenderBattleArray[randomIndex] = defenderBattleArray[defenderBattleArray.length - 1];
        console.log(defenderFighterCasualties, "defenderFighterCasualties")
        //inflict bomber damage if bombers are present
        bomberDamage += attackerBomberStrength
        console.log(bomberDamage, "bomberDamage")
        console.log(attackerBomberStrength, "attackerBomberStrength")
      } else if (randomModulus >= attackerFighterStrength) {
        console.log("defender wins")
        //a defender victory in a dogfight will remove an attacker fighter and an attacker bomber
        var randomIndex = Math.floor(Math.random() * attackerFightersInvolved)
        console.log(randomIndex, "randomIndex")
        console.log(attackerBattleArray[randomIndex], "type of attacker fighter lost")
        attackerFighterCasualties.push(attackerBattleArray[randomIndex])
        if(attackerFighterStrength >= attackerBattleArray[randomIndex]) {
          attackerFighterStrength -= attackerBattleArray[randomIndex]
        } else if (attackerFighterStrength < attackerBattleArray[randomIndex]) {
          attackerFighterStrength = 0
        }
        console.log(attackerFighterStrength, "new attackerFighterStrength")
        totalStrength -= attackerBattleArray[randomIndex]
        console.log(totalStrength, "new totalStrength")
        attackerBattleArray[randomIndex] = 0
        // attackerBattleArray[randomIndex] = attackerBattleArray[attackerBattleArray.length - 1];
        attackerBattleArray.splice(randomIndex, 1)
        attackerFightersInvolved -= 1
        console.log(attackerBattleArray, "attackerBattleArray")
        console.log(attackerFighterCasualties, "attackerFighterCasualties")
        //remove bomber
        if (attackerBomberBattleArray.length > 0) {
        var randomIndexForBomber = Math.floor(Math.random() * attackerBomberBattleArray.length)
        console.log(randomIndexForBomber, "randomIndexForBomber")
        attackerBomberCasualties.push(attackerBomberBattleArray[randomIndexForBomber])
        console.log(attackerBomberCasualties, "attackerBomberCasualties")
        attackerBomberStrength -= attackerBomberBattleArray[randomIndexForBomber]
        console.log(attackerBomberStrength, "new attackerBomberStrength")
        attackerBomberBattleArray[randomIndexForBomber] = 0
        attackerBomberBattleArray.splice(randomIndexForBomber, 1)
        console.log(attackerBomberBattleArray, "attackerBomberBattleArray")
        }
      }
    }

    console.log("BATTLE RESULTS")
    console.log(attackerFighterCasualties, "attackerFighterCasualties")
    console.log(attackerBomberCasualties, "attackerBomberCasualties")
    console.log(defenderFighterCasualties, "defenderFighterCasualties")
    console.log(bomberDamage, "bomberDamage")

    const infrastructureDamage = Math.floor(bomberDamage / 10)
    const tankDamage = Math.floor(bomberDamage / 4)
    const cruiseMissileDamage = Math.floor(bomberDamage / 20)

    console.log(infrastructureDamage, "infrastructureDamage")
    console.log(tankDamage, "tankDamage")
    console.log(cruiseMissileDamage, "cruiseMissileDamage")
 
    let eaResponse: EAOutput = {
        data: {},
        jobRunId: eaInputData.id,
        statusCode: 0,
    };

  const encoder = ethers.utils.defaultAbiCoder

  try {
    eaResponse.jobRunId = jobRunId;
    eaResponse.data.attackerFighterCasualties = encoder.encode(["uint256[]"], [attackerFighterCasualties])
    eaResponse.data.attackerBomberCasualties = encoder.encode(["uint256[]"], [attackerBomberCasualties])
    eaResponse.data.defenderFighterCasualties = encoder.encode(["uint256[]"], [defenderFighterCasualties])
    eaResponse.data.attackerId = eaInputData.data.attackerId
    eaResponse.data.defenderId = eaInputData.data.defenderId
    eaResponse.data.infrastructureDamage = infrastructureDamage
    eaResponse.data.tankDamage = tankDamage
    eaResponse.data.cruiseMissileDamage = cruiseMissileDamage
    eaResponse.data.battleId = eaInputData.data.attackId
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
