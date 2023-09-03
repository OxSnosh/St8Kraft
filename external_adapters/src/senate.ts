import process from "process";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

type EAInput = {
  id: number;
  data: {
    team: number;
    votes: number[];
  };
};

type EAOutput = {
  jobRunId: string | number;
  statusCode: number;
  data: {
    team?: number;
    result?: number[];
  };
  error?: string;
};

const PORT = process.env.PORT_SENATE_ELECTION || 8081;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Senate Elections Running");
});

app.post("/", async function (req: Request<{}, {}, EAInput>, res: Response) {
  const eaInputData: EAInput = req.body;
  console.log(" Request data received: ", eaInputData);

  let jobRunId = eaInputData.id;
  let nums = eaInputData.data.votes;
  let team = eaInputData.data.team;
  let freqs : any = {};
  let num;
  for (num of nums) {
      if (freqs[num] === undefined) { 
          freqs[num] = 1; 
      } else {
          freqs[num] = freqs[num] + 1;
      }
  }
  
  // Convert to array with [frequency, number] elements
  let frequencyArray : any = [];
  let key;
  for (key in freqs) {
      frequencyArray.push([freqs[key], key]);
  }
  
  // Sort in descending order with frequency as key
  frequencyArray.sort((a : any, b : any) => {
      return b[0] - a[0];
  });
  
  // Get most frequent element out of array
  let mostFreq : any = [];
  let k
  if (frequencyArray.length < 5) {
    k = frequencyArray.length;
  } else {
    k = 5;
  }
  for (let i = 0; i < k; i++) {
      mostFreq.push(frequencyArray[i][1]);
  }

  console.log("mostFreq: ", mostFreq);
  let eaResponse: EAOutput = {
    data: {},
    jobRunId: eaInputData.id,
    statusCode: 0,
  };

  try {
    eaResponse.jobRunId = jobRunId;
    eaResponse.data.team = team;
    eaResponse.data.result = mostFreq;
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
