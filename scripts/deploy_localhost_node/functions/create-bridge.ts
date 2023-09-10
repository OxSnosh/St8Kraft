import axios from "axios";
import { ActionType } from "hardhat/types";
import { v4 as uuidv4 } from "uuid";

import { login } from "../helpers/login";

declare interface QueryResponse {
  errors?: Array<{
    message: string;
  }>;
  data: any;
}

export const createBridge = async () => {
  const direct = "direct";
  const cron = "cron";

  const authenticationToken = await login();


  try {
    console.info("\nCreating Bridge...\n");

    const data = await axios.request<any, QueryResponse>({
      url: "http://127.0.0.1:6688/query",
      headers: {
        "content-type": "application/json",
        cookie: `blocalauth=localapibe315fd0c14b5e47:; isNotIncognito=true; _ga=GA1.1.2055974768.1644792885; ${authenticationToken}`,
        Referer: "http://127.0.0.1:6688/bridges/new",
      },
      method: "POST",
      data: {name: "bridge-3", url: "http://localhost.8081", minimumContractPayment: "0", confirmations: 0},
    });

    console.log("Bridge Created");
  } catch (e) {
    console.log("Could not create bridge");
    console.error(e);
  }
};