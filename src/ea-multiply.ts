import process from "process";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import ethers from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

type EAInput = {
  id: number | string;
  data: {
    defenderFighters: any;
    attackerFighters: any;
    attackerBombers: any;
    randomNumbers: any;
  };
};

type EAOutput = {
  jobRunId: string | number;
  statusCode: number;
  data: {
    attackerFighterCasualties: any;
    attackerBomberCasualties: any;
    defenderFighterCasualtties: any;
    bomberDamage: any;
    infrastructureDamage: any;
    tankDamage: any;
  };
  error?: string;
};

const PORT = process.env.AIR_BATTLE_PORT || 8080;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Hello World!");
});

app.post("/", async function (req: Request<{}, {}, EAInput>, res: Response) {
  const eaInputData: EAInput = req.body;
  console.log(" Request data received: ", eaInputData);

    let eaResponse: EAOutput = {
    data: {
      attackerFighterCasualties: [],
      attackerBomberCasualties: [],
      defenderFighterCasualtties: [],
      bomberDamage: 0,
      infrastructureDamage: 0,
      tankDamage: 0
    },
    jobRunId: eaInputData.id,
    statusCode: 0,
  };

  try {
    // It's common practice to store the desired result value in a top-level result field.
    eaResponse.data = {     
      attackerFighterCasualties: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      attackerBomberCasualties: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      defenderFighterCasualtties: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      bomberDamage: 100,
      infrastructureDamage: 50,
      tankDamage: 5000  
    };
    eaResponse.statusCode = 200;

    res.json(eaResponse);
  } catch (error: any) {
    console.error("Response Error: ", error);
    eaResponse.error = error.message;
    eaResponse.statusCode = error.response.status;

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