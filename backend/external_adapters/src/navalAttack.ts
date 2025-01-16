import process from "process";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { ethers } from "ethers";
import { AbiCoder } from "ethers/lib/utils";
dotenv.config();

type EAInput = {
  id: number;
  data: {
    battleId : number;
    randomWords : string;
    attackerChances: string;
    attackerTypes: string;
    defenderChances: string;
    defenderTypes: string;
  }
};

type EAOutput = {
  jobRunId: string | number;
  statusCode: number;
  data: {
    attackerLosses: number[];
    defenderLosses: number[];
    battleId?: number;
  };
  error?: string;
};

const PORT = 8088;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Air Battle Running");
});

app.post("/", async function (req: Request<{}, {}, EAInput>, res: Response) {
    const eaInputData: EAInput = req.body;
    console.log(" Request data received: ", eaInputData);

    console.log("and so it begins");

    function base64ToIntArray(base64String: string): number[] {
        // Decode the Base64 string
        const decoded = Buffer.from(base64String, 'base64');
      
        // Convert decoded buffer to an array of 16-bit integers
        const intArray: number[] = [];
        for (let i = 0; i < decoded.length; i += 2) {
          // Combine two bytes to form a 16-bit integer
          const num = decoded.readUInt16BE(i);
          intArray.push(num);
        }
      
        // Filter the meaningful values (non-zero values only)
        const meaningfulValues = intArray.filter(num => num > 0);
      
        return meaningfulValues;
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

    let randomNumbersRaw = decodeBase64ToUint256Array(eaInputData.data.randomWords)
    let randomNumbers = randomNumbersRaw.slice(2)
    let attackerChancesRaw = base64ToIntArray(eaInputData.data.attackerChances)
    let attackerChances = attackerChancesRaw.slice(2)
    let attackerTypesRaw = base64ToIntArray(eaInputData.data.attackerTypes)
    let attackerTypes = attackerTypesRaw.slice(2)
    let defenderChancesRaw = base64ToIntArray(eaInputData.data.defenderChances)
    let defenderChances = defenderChancesRaw.slice(2)
    let defenderTypesRaw = base64ToIntArray(eaInputData.data.defenderTypes)
    let defenderTypes = defenderTypesRaw.slice(2)

    console.log("Random Numbrs")
    console.log(randomNumbers)
    console.log("attacker chances",
        attackerChances,
        "attacker Types",
        attackerTypes,
        "defender Chances",
        defenderChances,
        "defender Types",
        defenderTypes        
    )

    function createChunks(numbers: bigint[]) {
        let chunks: string[] = []; // Declare chunks outside the loop to store all results
    
        for (let i = 0; i < numbers.length; i++) { // Iterate over all numbers
            let numberToSlice = BigInt(numbers[i]).toString(); // Convert the number to BigInt and then to a string
            let sliceNumber = 0;
    
            for (let j = 0; j < 5; j++) { // Extract 5 chunks per number
                let chunk = numberToSlice.slice(sliceNumber, sliceNumber + 10);
                if (chunk.length === 10) { // Ensure the chunk has 10 digits
                    chunks.push(chunk);
                }
                sliceNumber += 10; // Move to the next slice
            }
        }
    
        return chunks;
    }

    let chunks : string[] = createChunks(randomNumbers)

    let corvetteTargetSize = 15;
    let landingShipTargetSize = 13;
    let battleshipTargetSize = 11;
    let cruiserTargetSize = 10;
    let frigateTargetSize = 8;
    let destroyerTargetSize = 5;
    let submarineTargetSize = 4;
    let aircraftCarrierTargetSize = 1;

    function amountToDecreaseFunction(type : number) {
        let amountToDecrease = 0
        if (type == 1) {
            amountToDecrease = corvetteTargetSize
        } else if (type == 2) {
            amountToDecrease = landingShipTargetSize
        } else if (type == 3) {
            amountToDecrease = battleshipTargetSize
        } else if (type == 4) {
            amountToDecrease = cruiserTargetSize
        } else if (type == 5) {
            amountToDecrease = frigateTargetSize
        } else if (type == 6) {
            amountToDecrease = destroyerTargetSize
        } else if (type == 7) {
            amountToDecrease = submarineTargetSize
        } else if (type == 8) {
            amountToDecrease = aircraftCarrierTargetSize
        }
        return amountToDecrease
    }

    function shipCount(typeArray : number[], chanceArray: number[]) {
        let shipCount = 0
        for (let i=0; i < typeArray.length ; i++) {
            let type = typeArray[i]
            let divisor = 0
            if (type == 1) {
                divisor = corvetteTargetSize
            } else if (type == 2) {
                divisor = landingShipTargetSize
            } else if (type == 3) {
                divisor = battleshipTargetSize
            } else if (type == 4) {
                divisor = cruiserTargetSize
            } else if (type == 5) {
                divisor = frigateTargetSize
            } else if (type == 6) {
                divisor = destroyerTargetSize
            } else if (type == 7) {
                divisor = submarineTargetSize
            } else if (type == 8) {
                divisor = aircraftCarrierTargetSize
            }

            let numberToDivide;
            let shipToAdd;
    
            if (i === 0) {
                numberToDivide = chanceArray[i];
            } else {
                numberToDivide = chanceArray[i] - chanceArray[i - 1];
            }
    
            shipToAdd = numberToDivide / divisor;
            shipCount += shipToAdd;
        }
        return shipCount
    }

    let shipCountAttacker = shipCount(attackerTypes, attackerChances)
    console.log(shipCountAttacker)
    let shipCountdefender = shipCount(defenderTypes, defenderChances)
    console.log(shipCountdefender)

    let totalShipCount : number = (shipCountAttacker + shipCountdefender)

    function calculateLosses( totalShips : number) {
        let numberBetweenZeroAndTwo = ( Number(chunks[0]) % 3 )
        console.log(numberBetweenZeroAndTwo)
        let losses
        if (totalShips < 4) {
            losses = 1;
        } else if (totalShips <= 10) {
            losses = (1 + numberBetweenZeroAndTwo);
        } else if (totalShips <= 30) {
            losses = (2 + numberBetweenZeroAndTwo);
        } else if (totalShips <= 50) {
            losses = (3 + numberBetweenZeroAndTwo);
        } else if (totalShips <= 70) {
            losses = (4 + numberBetweenZeroAndTwo);
        } else if (totalShips <= 100) {
            losses = (5 + numberBetweenZeroAndTwo);
        } else {
            losses = (6 + numberBetweenZeroAndTwo);
        }
        return losses;
    }

    let losses = calculateLosses(totalShipCount);
    console.log(losses)

    function calulateBattleResults(
        losses : number,
        attackerChances : number[],
        attackerTypes : number[],
        defenderChances : number[],
        defenderTypes : number[]
    ): [number[], number[]] {
        let attackerLosses : number[] = []
        let defenderLosses : number[] = []

        console.log("here?")
        for (let i=1; i<=losses; i++) {
            let randomNumber = Number(chunks[i])
            let totalStrength : number = (attackerChances[attackerChances.length-1] + defenderChances[defenderChances.length-1])
            let selector = (randomNumber % totalStrength)
            console.log(totalStrength, "totalStrength")
            console.log(randomNumber, "randomNumber")
            console.log(selector, "selector")
            if (selector < attackerChances[attackerChances.length-1]) {
                //loss for defender
                console.log("defender loss")
                let secondRandomNumber = Number(chunks[i+10])
                let shipSelector = (secondRandomNumber % defenderChances[defenderChances.length-1])
                let shipType
                let amountToDecrease: number | undefined = undefined;
                let k: number | undefined = undefined;
                let ranAlready = false
                if (ranAlready == false) {
                    for (let j = 0; j < defenderChances.length; j++) {
                        if (shipSelector < defenderChances[j]) {
                            defenderLosses.push(defenderTypes[j])   
                            shipType = defenderTypes[j]
                            amountToDecrease = amountToDecreaseFunction(shipType)
                            k=j
                            break
                        }
                    }
                    console.log(k, "k")
                    console.log(amountToDecrease)
                    if (k !== undefined && amountToDecrease !== undefined) {
                        for (let index = k; index < defenderChances.length; index++) {
                            if (defenderChances[k] >= randomNumber) {
                                defenderChances[k] -= amountToDecrease
                            }
                        }
                        ranAlready = true
                    }
                } else {
                    console.error("k or amountToDecrease is undefined. Skipping iteration.")
                }
            } else {
                //loss for attacker
                console.log("attacker loss")
                let secondRandomNumber = Number(chunks[i+10])
                let shipSelector = (secondRandomNumber % attackerChances[attackerChances.length-1])
                let shipType
                let amountToDecrease: number | undefined = undefined;
                let k: number | undefined = undefined;
                let ranAlready = false
                if (ranAlready == false){
                    for (let j = 0; j < attackerChances.length; j++) {
                        if (shipSelector < attackerChances[j]) {
                            attackerLosses.push(attackerTypes[j])   
                            shipType = attackerTypes[j]
                            amountToDecrease = amountToDecreaseFunction(shipType)
                            k=j
                            break
                        }
                    }
                    console.log(k, "k")
                    console.log(amountToDecrease)
                    if (k !== undefined && amountToDecrease !== undefined) {
                        for (let index = k; index < attackerChances.length; index++) {
                            if (attackerChances[k] >= randomNumber) {
                                attackerChances[k] -= amountToDecrease
                            }
                        }
                        ranAlready = true
                    } else {
                        console.error("k or amountToDecrease is undefined. Skipping iteration.")
                    }
                }
            }
        }
        return [ attackerLosses, defenderLosses ]
    }

    let results = calulateBattleResults(losses, attackerChances, attackerTypes, defenderChances, defenderTypes)
    let attackerLossesRaw = results[0]
    let defenderLossesRaw = results[1]

    const encoder = ethers.utils.defaultAbiCoder
   
    let defenderLosses = defenderLossesRaw
    let attackerLosses = attackerLossesRaw

    // let attackerLosses = attackerLossesRaw.length > 0 
    //     ? encoder.encode(["uint256[]"], [attackerLossesRaw]) 
    //     : encoder.encode(["uint256[]"], [[]]);
    
    // let defenderLosses = defenderLossesRaw.length > 0 
    //     ? encoder.encode(["uint256[]"], [defenderLossesRaw]) 
    //     : encoder.encode(["uint256[]"], [[]]);
 
    let battleId = eaInputData.data.battleId 

    let eaResponse: EAOutput = {
        data: {
            attackerLosses,
            defenderLosses,
            battleId
        },
        jobRunId: eaInputData.id,
        statusCode: 0,
    };

  try {
    eaResponse.jobRunId = eaInputData.id
    eaResponse.data.attackerLosses = attackerLosses
    eaResponse.data.defenderLosses = defenderLosses
    eaResponse.data.battleId = battleId
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