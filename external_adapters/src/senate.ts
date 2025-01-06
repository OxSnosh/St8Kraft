import process from "process";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import {ethers} from "ethers"
dotenv.config();

const decoder = ethers.utils.defaultAbiCoder

type EAInput = {
  id: string;
  data: {
    epoch: number
    orderId: number;
    teamNumber: number;
    teamVotes: string;
  };
};

type EAOutput = {
  requestId: string;
  statusCode: number;
  data: {
    winners?: string;
    team?: number;
    _epoch: number
  };
  error?: string;
};

const PORT = 8083;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Senate Elections Running");
});

app.post("/", async function (req: Request<{}, {}, EAInput>, res: Response) {
  const eaInputData: EAInput = req.body;
  console.log(" Request data received: ", eaInputData);

  console.log("raw data", eaInputData.data.teamVotes)
  let rawData = eaInputData.data.teamVotes
  let nums
  if (rawData === undefined) {
    nums = [0]
  }

  function decodeBase64ToSpecificArray(base64String: string ) {
    // Decode Base64 string to Buffer
    const buffer = Buffer.from(base64String, 'base64');

    // Convert Buffer to Uint8Array
    const uint8Array = new Uint8Array(buffer);

    // Process the array to include only non-zero values
    const result = [];
    for (let i = 0; i < uint8Array.length; i++) {
        const value = uint8Array[i];
        if (value !== 0) { // Exclude zeros
            result.push(value);
        }
    }

    // Remove the first value
    return result.slice(1);
  }

  let rawVotes : string = eaInputData.data.teamVotes

  nums = decodeBase64ToSpecificArray(rawVotes)

  console.log("nums", nums)

  let num
  let freqs : any = {};
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
  
  const encodedData = decoder.encode(
     ["uint[]"],
     [mostFreq.length > 0 ? mostFreq.map(Number) : [0]] // Default to [0] if empty
   );
  
   let eaResponse: EAOutput = {
    requestId: eaInputData.id,
    data:  {
      winners: encodedData,
      team: eaInputData.data.teamNumber,
      _epoch: eaInputData.data.epoch
    },
    statusCode: 0,
  };

  try {
    eaResponse.requestId = eaInputData.id;
    eaResponse.data.team = eaInputData.data.teamNumber;
    eaResponse.data.winners = encodedData;
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
