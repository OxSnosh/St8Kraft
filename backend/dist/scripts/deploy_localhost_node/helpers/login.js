"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const axios_1 = __importDefault(require("axios"));
const login = async (email = "user@hardhatchainlink.io", password = "strongpassword777") => {
    try {
        console.info(`\nAuthenticating User ${email} using password ${password}\n`);
        const authResponse = await axios_1.default.post("http://127.0.0.1:6688/sessions", { email, password }, {
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                referer: "http://127.0.0.1:6688/signin",
            },
        });
        // const response = await fetch("http://127.0.0.1:6688/sessions", {
        //   method: 'POST',
        //   headers: {
        //     'accept': 'application/json',
        //     'content-type': 'application/json',
        //     'referer': 'http://127.0.0.1:6688/signin'
        //   },
        //   body: JSON.stringify({ email, password })
        // });
        // const authResponse = await response.json();
        // console.log("authResponse", authResponse)
        if (authResponse.status === 429) {
            throw new Error("Too Many Requests");
        }
        const regex = /clsession=[a-zA-Z0-9=\-_]+/g; // Grab the session token
        const cookies = authResponse.headers["set-cookie"];
        const sessionCookie = cookies === null || cookies === void 0 ? void 0 : cookies.find((cookie) => cookie.match("clsession"));
        const session = sessionCookie === null || sessionCookie === void 0 ? void 0 : sessionCookie.match(regex);
        if (session !== null && session !== undefined) {
            return session[0];
        }
        else {
            throw new Error("Authentication cookie not found");
        }
    }
    catch (err) {
        if (err.response) {
            // The request was made and the server responded with a status code
            console.error('Response data:', err.response.data);
            console.error('Response status:', err.response.status);
            console.error('Response headers:', err.response.headers);
        }
        else if (err.request) {
            // The request was made but no response was received
            console.error('Request data:', err.request);
        }
        else {
            // Something happened in setting up the request that triggered an error
            console.error('Error:', err.message);
        }
        return "";
    }
};
exports.login = login;
