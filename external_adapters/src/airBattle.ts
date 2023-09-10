import process from "process";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

type EAInput = {
  id: number;
  data: {
    attackId : number
    defenderFightersArr : number[]
    attackerFightersArr : number[]
    attackerBombersArr : number[]
    randomNumbers : number[]
    attackerId : number
    defenderId : number
  };
};

type EAOutput = {
  jobRunId: string | number;
  statusCode: number;
  data: {
    attackerFighterCasualties?: number[];
    attackerBomberCasualties?: number[];
    defenderFighterCasualties?: number[];
    attackerId?: number;
    defenderId?: number;
    infrastructureDamage?: number;
    tankDamage?: number;
    cruiseMissileDamage?: number;
    battleId?: number;
  };
  error?: string;
};

const PORT = process.env.PORT_AIR_BATTLE || 8080;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Senate Elections Running");
});

app.post("/", async function (req: Request<{}, {}, EAInput>, res: Response) {
    const eaInputData: EAInput = req.body;
    console.log(" Request data received: ", eaInputData);

    let jobRunId = eaInputData.id;
    let attackId = eaInputData.data.attackId;
    const defenderFightersArr = eaInputData.data.defenderFightersArr;
    const attackerFightersArr = eaInputData.data.attackerFightersArr;
    const attackerBombersArr = eaInputData.data.attackerBombersArr;
    let randomNumbers = eaInputData.data.randomNumbers

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
    const number = randomNumbers[0].toString().substring(i, i + 10)
    numbers.push(Number(number))
    }
    for (let i = 0; i < 50; i += 10) {
    const number = randomNumbers[1].toString().substring(i, i + 10)
    numbers.push(Number(number))
    }
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
        console.log(randomIndex, "randomIndex")
        console.log(defenderBattleArray[randomIndex], "type of defender fighter lost")
        defenderFighterCasualties.push(defenderBattleArray[randomIndex])
        defenderFighterStrength -= defenderBattleArray[randomIndex]
        console.log(defenderFighterStrength, "new defenderFighterStrength")
        totalStrength -= defenderBattleArray[randomIndex]
        console.log(totalStrength, "new totalStrength")
        defenderBattleArray[randomIndex] = 0
        // defenderBattleArray[randomIndex] = defenderBattleArray[defenderBattleArray.length - 1];
        defenderBattleArray.splice(randomIndex, 1)
        defenderFightersInvolved -= 1
        console.log(defenderBattleArray, "defenderBattleArray")
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
        attackerFighterStrength -= attackerBattleArray[randomIndex]
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

  try {
    eaResponse.jobRunId = jobRunId;
    eaResponse.data.attackerFighterCasualties = attackerFighterCasualties
    eaResponse.data.attackerBomberCasualties = attackerBomberCasualties
    eaResponse.data.defenderFighterCasualties = defenderFighterCasualties
    eaResponse.data.attackerId = eaInputData.data.attackerId
    eaResponse.data.defenderId = eaInputData.data.defenderId
    eaResponse.data.infrastructureDamage = infrastructureDamage
    eaResponse.data.tankDamage = tankDamage
    eaResponse.data.cruiseMissileDamage = cruiseMissileDamage
    eaResponse.data.battleId = attackId
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
