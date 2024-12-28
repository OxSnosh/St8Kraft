import process from "process";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import ethers from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

type EAInput = {
  id: number | string;
  data: {
    numberToMultiply: number
  };
};

type EAOutput = {
  jobRunId: string | number;
  statusCode: number;
  data: {
    product: number
  };
  error?: string;
};

const PORT = 8081;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Hello World!");
});

app.post("/", async function (req: Request<{}, {}, EAInput>, res: Response) {
  const eaInputData: EAInput = req.body;
  console.log(" Request data received: ", eaInputData);

    let answer = eaInputData.data.numberToMultiply * 1000

    let eaResponse: EAOutput = {
    data: {
      product: answer,
    },
    jobRunId: eaInputData.id,
    statusCode: 0,
  };

  try {
    // It's common practice to store the desired result value in a top-level result field.
    eaResponse.data.product = answer
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