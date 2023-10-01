import process from "process";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

type EAInput = {
  id: number;
  data: {
    inputNumber : number
  };
};

type EAOutput = {
  jobRunId: string | number;
  statusCode: number;
  data: {
    number: number;
  };
  error?: string;
};

const PORT =  8081;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("TEST EA RUNNING");
});

app.post("/", async function (req: Request<{}, {}, EAInput>, res: Response) {
    const eaInputData: EAInput = req.body;
    console.log(" Request data received: ", eaInputData);

    let inputNumber = eaInputData.data.inputNumber

    console.log("inputNumber:  ", inputNumber);

    let outputNumber = inputNumber * 1000

    console.log("outputNumber:  ", outputNumber);

    let eaResponse: EAOutput = {
        jobRunId: eaInputData.id,
        statusCode: 200,
        data: {
            number: outputNumber
        }
    }

    try {
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