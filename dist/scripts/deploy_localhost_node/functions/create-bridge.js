"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBridge = void 0;
const axios_1 = __importDefault(require("axios"));
const login_1 = require("../helpers/login");
const createBridge = async (name, url, minimumContractPayment, confirmations) => {
    const direct = "direct";
    const cron = "cron";
    const authenticationToken = await (0, login_1.login)();
    // console.log(authenticationToken);
    try {
        console.info("\nCreating Bridge...\n");
        const data = await axios_1.default.request({
            url: "http://127.0.0.1:6688/query",
            headers: {
                "content-type": "application/json",
                cookie: `blocalauth=localapibe315fd0c14b5e47:; isNotIncognito=true; _ga=GA1.1.2055974768.1644792885; ${authenticationToken}`,
                Referer: "http://127.0.0.1:6688/bridges/new",
            },
            method: "POST",
            data: {
                operationName: "CreateBridge",
                variables: {
                    input: {
                        name, url, minimumContractPayment, confirmations
                    }
                },
                query: "mutation CreateBridge($input: CreateBridgeInput!) {createBridge(input: $input) { ... on CreateBridgeSuccess { bridge { id __typename }incomingToken __typename } __typename } }"
            },
        });
        console.log(data.data);
        console.log("Bridge Created");
    }
    catch (e) {
        console.log("Could not create bridge");
        console.error(e);
    }
};
exports.createBridge = createBridge;
