"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const login_1 = require("../helpers/login");
const getInfo = async (authToken) => {
    const response = await axios_1.default.request({
        url: "http://127.0.0.1:6688/query",
        headers: {
            "content-type": "application/json",
            cookie: `blocalauth=localapibe315fd0c14b5e47:; isNotIncognito=true; _ga=GA1.1.2055974768.1644792885; ${authToken}`,
            Referer: "http://127.0.0.1:6688/jobs/new",
        },
        data: '{"operationName":"FetchAccountBalances","variables":{},"query":"fragment AccountBalancesPayload_ResultsFields on EthKey {\\n  address\\n  chain {\\n    id\\n    __typename\\n  }\\n  ethBalance\\n  linkBalance\\n  __typename\\n}\\n\\nquery FetchAccountBalances {\\n  ethKeys {\\n    results {\\n      ...AccountBalancesPayload_ResultsFields\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}',
        method: "POST",
    });
    return response.data;
};
const nodeInfo = async () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    console.log("Getting Node Info...");
    const authenticationToken = await (0, login_1.login)();
    try {
        const info = await getInfo(authenticationToken);
        if (info.errors != null) {
            console.log("Errors found when trying to get node info:\n");
            console.log(info.errors.reduce((acc, error) => {
                acc += `\t${error.message}\n`;
                return acc;
            }, "\t"));
        }
        else {
            console.table({
                Address: (_c = (_b = (_a = info.data) === null || _a === void 0 ? void 0 : _a.ethKeys) === null || _b === void 0 ? void 0 : _b.results[0]) === null || _c === void 0 ? void 0 : _c.address,
                Balance: (_f = (_e = (_d = info.data) === null || _d === void 0 ? void 0 : _d.ethKeys) === null || _e === void 0 ? void 0 : _e.results[0]) === null || _f === void 0 ? void 0 : _f.ethBalance,
                ChainID: (_k = (_j = (_h = (_g = info.data) === null || _g === void 0 ? void 0 : _g.ethKeys) === null || _h === void 0 ? void 0 : _h.results[0]) === null || _j === void 0 ? void 0 : _j.chain) === null || _k === void 0 ? void 0 : _k.id,
            });
            const address = (_o = (_m = (_l = info.data) === null || _l === void 0 ? void 0 : _l.ethKeys) === null || _m === void 0 ? void 0 : _m.results[0]) === null || _o === void 0 ? void 0 : _o.address;
            return [address, authenticationToken];
        }
    }
    catch (error) {
        console.log("Could not get Node address reason: ", error);
    }
};
exports.nodeInfo = nodeInfo;
