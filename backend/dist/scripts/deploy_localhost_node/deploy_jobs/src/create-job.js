"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJob = void 0;
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const login_1 = require("../../helpers/login");
// export const createJob = async (taskArgs: any) => {
//   const direct = "direct";
//   const cron = "cron";
//   const { oracleAddress, jobType } = taskArgs;
//   const authenticationToken = await login();
//   const externalID = uuidv4();
//   const jobName = `Get > Uint256: ${new Date().getMilliseconds()}`;
//   const defaultJob = {
//     operationName: "CreateJob",
//     variables: {
//       input: {
//         TOML: `
//           type = "directrequest"
//           schemaVersion = 1
//           name = "${jobName}"
//           # Optional External Job ID: Automatically generated if unspecified
//           externalJobID = "${externalID}"
//           contractAddress = "${oracleAddress}"
//           maxTaskDuration = "0s"
//           observationSource = """
//             decode_log   [type="ethabidecodelog"
//                           abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
//                           data="$(jobRun.logData)"
//                           topics="$(jobRun.logTopics)"]
//             decode_cbor  [type="cborparse" data="$(decode_log.data)"]
//             fetch        [type="http" method=GET url="$(decode_cbor.get)" allowUnrestrictedNetworkAccess="true"]
//             parse        [type="jsonparse" path="$(decode_cbor.path)" data="$(fetch)"]
//             multiply     [type="multiply" input="$(parse)" times=100]
//             encode_data  [type="ethabiencode" abi="(uint256 value)" data="{ \\"value\\": $(multiply) }"]
//             encode_tx    [type="ethabiencode"
//                           abi="fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)"
//                           data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\": $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_data)}"
//                           ]
//             submit_tx    [type="ethtx" to="${oracleAddress}" data="$(encode_tx)"]
//             decode_log -> decode_cbor -> fetch -> parse -> multiply -> encode_data -> encode_tx -> submit_tx
//           """
//         `,
//       },
//     },
//     query: `
//       mutation CreateJob($input: CreateJobInput!) {
//         createJob(input: $input) {
//           ... on CreateJobSuccess {
//             job {
//               id
//               __typename
//             }
//           }
//           ... on InputErrors {
//             errors {
//               path
//               message
//               code
//               __typename
//             }
//           }
//         }
//       }
//     `,
//   };
//   let jobDesc;
//   switch (jobType) {
//     case direct:
//       jobDesc = defaultJob;
//       break;
//     case cron:
//       jobDesc = {
//         operationName: "CreateJob",
//         variables: {
//           input: {
//             TOML: `
//               type = "cron"
//               schemaVersion = 1
//               name = "${jobName}"
//               externalJobID = "${externalID}"
//               contractAddress = "${oracleAddress}"
//               maxTaskDuration = "0s"
//               schedule = "CRON_TZ=UTC * */20 * * * *"
//               observationSource = """
//                 fetch    [type="http" method=GET url="https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD"]
//                 parse    [type="jsonparse" path="RAW,ETH,USD,PRICE"]
//                 multiply [type="multiply" times=100]
//                 fetch -> parse -> multiply
//               """
//             `,
//           },
//         },
//         query: `
//           mutation CreateJob($input: CreateJobInput!) {
//             createJob(input: $input) {
//               ... on CreateJobSuccess {
//                 job {
//                   id
//                   __typename
//                 }
//               }
//               ... on InputErrors {
//                 errors {
//                   path
//                   message
//                   code
//                   __typename
//                 }
//               }
//             }
//           }
//         `,
//       };
//       break;
//     default:
//       jobDesc = defaultJob;
//   }
//   try {
//     console.info("\nCreating Job...\n");
//     const response = await axios.request<any>({
//       url: "http://127.0.0.1:6688/query",
//       headers: {
//         "Content-Type": "application/json",
//         cookie: `blocalauth=localapibe315fd0c14b5e47:; isNotIncognito=true; _ga=GA1.1.2055974768.1644792885; ${authenticationToken}`,
//         Referer: "http://127.0.0.1:6688/jobs/new",
//       },
//       method: "POST",
//       data: jobDesc,
//     });
//     const dataToWrite = `export const jobId = "${externalID}";\n`;
//     // Define the path
//     const outputPath = path.join(__dirname, "..", "jobMetadata.ts");
//     // Writing to the file
//     fs.writeFileSync(outputPath, dataToWrite);
//     console.log(
//       "Response", response.data?.data?.data?.createJob
//     )
//     console.table({
//       Status: "Success",
//       Error: response.data.errors != null ? response.data.errors[0].message : null,
//       JobID: response.data?.data?.data?.createJob?.job?.id,
//       ExternalID: externalID,
//     });
//   } catch (e) {
//     console.log("Could not create job");
//     console.error(e);
//   }
// };
const createJob = async (taskArgs) => {
    const direct = "direct";
    const cron = "cron";
    const { oracleAddress, jobType } = taskArgs;
    const authenticationToken = await (0, login_1.login)();
    const externalID = (0, uuid_1.v4)();
    const airBattleExternalID = (0, uuid_1.v4)();
    const senateExternalID = (0, uuid_1.v4)();
    const groundBattleExternalID = (0, uuid_1.v4)();
    const navalAttackExternalID = (0, uuid_1.v4)();
    const jobName = `Get > Uint256: ${new Date().getMilliseconds()}`;
    const jobNameAirBattle = `Get > Uint256: ${new Date().getMilliseconds()}`;
    const jobNameSenate = `Get > Uint256: ${new Date().getMilliseconds()}`;
    const groundBattleName = `Get > Uint256: ${new Date().getMilliseconds()}`;
    const navalAttackName = `Get > Uint256: ${new Date().getMilliseconds()}`;
    //       const defaultJob = `{    
    //         "operationName":"CreateJob",    
    //         "variables":{      
    //         "input":{        
    //         "TOML":"type = \\"directrequest\\"\\nschemaVersion = 1\\nname = \\"${jobName}\\"\\n# Optional External Job ID: Automatically generated if unspecified\\n externalJobID = \\"${externalID}\\"\\nmaxTaskDuration = \\"0s\\"\\ncontractAddress = \\"${oracleAddress}\\"\\nobservationSource = \\"\\"\\"\\n    decode_log   [type=\\"ethabidecodelog\\"\\n                  abi=\\"OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)\\"\\n                  data=\\"$(jobRun.logData)\\"\\n                  topics=\\"$(jobRun.logTopics)\\"]\\n\\n    decode_cbor  [type=\\"cborparse\\" data=\\"$(decode_log.data)\\"]\\n    fetch        [type=\\"http\\" method=GET url=\\"$(decode_cbor.get)\\" allowUnrestrictedNetworkAccess=\\"true\\"]\\n                                                                parse        [type=\\"jsonparse\\" path=\\"$(decode_cbor.path)\\" data=\\"$(fetch)\\"]\\n    multiply     [type=\\"multiply\\" input=\\"$(parse)\\" times=100]\\n    encode_data  [type=\\"ethabiencode\\" abi=\\"(uint256 value)\\" data=\\"{ \\\\\\\\\\"value\\\\\\\\\\": $(multiply) }\\"]\\n                                               encode_tx    [type=\\"ethabiencode\\"\\n                  abi=\\"fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)\\"\\n                  data=\\"{\\\\\\\\\\"requestId\\\\\\\\\\": $(decode_log.requestId), \\\\\\\\\\"payment\\\\\\\\\\": $(decode_log.payment), \\\\\\\\\\"callbackAddress\\\\\\\\\\": $(decode_log.callbackAddr), \\\\\\\\\\"callbackFunctionId\\\\\\\\\\": $(decode_log.callbackFunctionId), \\\\\\\\\\"expiration\\\\\\\\\\": $(decode_log.cancelExpiration), \\\\\\\\\\"data\\\\\\\\\\": $(encode_data)}\\"\\n]\\n    submit_tx    [type=\\"ethtx\\" to=\\"${oracleAddress}\\" data=\\"$(encode_tx)\\"]\\n\\n    decode_log -> decode_cbor -> fetch -> parse -> multiply -> encode_data -> encode_tx -> submit_tx\\n\\"\\"\\"\\n"}},
    //         "query":"mutation CreateJob($input: CreateJobInput!) {\\n  createJob(input: $input) {\\n    ... on CreateJobSuccess {\\n      job {\\n        id\\n        __typename\\n      }\\n      __typename\\n    }\\n    ... on InputErrors {\\n      errors {\\n        path\\n        message\\n        code\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`;
    const defaultJob = `{    
      "operationName":"CreateJob",
      "variables":{
      "input":{        
      "TOML":"type = \\"directrequest\\"\\nschemaVersion = 1\\nname = \\"${jobName}\\"\\n                                                                         externalJobID = \\"${externalID}\\"\\nmaxTaskDuration = \\"0s\\"\\ncontractAddress = \\"${oracleAddress}\\"\\nobservationSource = \\"\\"\\"\\n    decode_log   [type=\\"ethabidecodelog\\"\\n                  abi=\\"OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)\\"\\n                  data=\\"$(jobRun.logData)\\"\\n                  topics=\\"$(jobRun.logTopics)\\"]\\n\\n    decode_cbor  [type=\\"cborparse\\" data=\\"$(decode_log.data)\\"]\\n    fetch        [type=\\"bridge\\" name=\\"multiply\\" requestData=\\"{\\"id\\": $(jobSpec.externalJobID), \\"data\\": { \\"numberToMultiply\\": $(decode_cbor.inputNumber)}}]\\n     parse        [type=\\"jsonparse\\" path=\\"data,product\\" data=\\"$(fetch)\\"]\\n                                                                                   encode_data  [type=\\"ethabiencode\\" abi=\\"(bytes32 requestId, uint256 value)\\" data=\\"{ \\"requestId\\": $(decode_log.requestId), \\"value\\": $(parse) }\\"]\\n     encode_tx    [type=\\"ethabiencode\\"\\n                  abi=\\"fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)\\"\\n          data=\\"{\\\\\\\\\\"requestId\\\\\\\\\\": $(decode_log.requestId), \\\\\\\\\\"payment\\\\\\\\\\": $(decode_log.payment), \\\\\\\\\\"callbackAddress\\\\\\\\\\": $(decode_log.callbackAddr), \\\\\\\\\\"callbackFunctionId\\\\\\\\\\": $(decode_log.callbackFunctionId), \\\\\\\\\\"expiration\\\\\\\\\\": $(decode_log.cancelExpiration), \\\\\\\\\\"data\\\\\\\\\\": $(encode_data)}\\"\\n]\\n    submit_tx    [type=\\"ethtx\\" to=\\"${oracleAddress}\\" data=\\"$(encode_tx)\\"]\\n\\n    decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx            \\n\\"\\"\\"\\n"}},
      "query":"mutation CreateJob($input: CreateJobInput!) {\\n  createJob(input: $input) {\\n    ... on CreateJobSuccess {\\n      job {\\n        id\\n        __typename\\n      }\\n      __typename\\n    }\\n    ... on InputErrors {\\n      errors {\\n        path\\n        message\\n        code\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`;
    // console.log(defaultJob);
    // const outputForConsole = `
    //     type = "directrequest"
    //     schemaVersion = 1
    //     name = "${jobName}"
    //     externalJobID = "${externalID}"
    //     maxTaskDuration = "0s"
    //     contractAddress = "${oracleAddress}"
    //     observationSource = """
    //         decode_log   [type=ethabidecodelog
    //                       abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
    //                       data="$(jobRun.logData)"
    //                       topics="$(jobRun.logTopics)"]
    //         decode_cbor  [type=cborparse data="$(decode_log.data)"]
    //         fetch        [type=bridge name="multiply" requestData="{\\"id\\": $(jobSpec.externalJobID), \\"data\\": { \\"numberToMultiply\\": $(decode_cbor.inputNumber)}}"]
    //         parse        [type=jsonparse path="data,product" data="$(fetch)"]
    //         encode_data  [type=ethabiencode abi="(bytes32 requestId, uint256 value)" data="{ \\"requestId\\": $(decode_log.requestId), \\"value\\": $(parse) }"]
    //         encode_tx    [type=ethabiencode
    //                       abi="fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)"
    //                       data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\": $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_data)}"
    //                     ]
    //         submit_tx    [type=ethtx to="${oracleAddress}" data="$(encode_tx)"]
    //         decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx
    //     """
    // `
    // const airBattleOutputForConsole = `
    // type = "directrequest"
    // schemaVersion = 1
    // name = "${jobNameAirBattle}"
    // externalJobID = "${airBattleExternalID}"
    // maxTaskDuration = "0s"
    // contractAddress = "${oracleAddress}"
    // observationSource = """
    // decode_log   [type=ethabidecodelog
    //   abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
    //   data="$(jobRun.logData)"
    //   topics="$(jobRun.logTopics)"]
    // decode_cbor  [type=cborparse data="$(decode_log.data)"]
    // fetch        [type=bridge name="air-battle" requestData="{\\"id\\": $(jobSpec.externalJobID), \\"data\\": $(decode_cbor)}"]
    // parse       [type=jsonparse path="data" data="$(fetch)"]
    // encode_data  [type=ethabiencode abi="(bytes32 requestId, bytes memory attackerFighterCasualties, bytes memory attackerBomberCasualties, bytes memory defenderFighterCasualties, uint256 attackerId, uint256 defenderId, uint256 infrastructureDamage, uint256 tankDamage, uint256 cruiseMissileDamage, uint256 battleId)" data="{ \\"requestId\\": $(decode_log.requestId), \\"attackerFighterCasualties\\": $(parse.attackerFighterCasualties), \\"attackerBomberCasualties\\": $(parse.attackerBomberCasualties), \\"defenderFighterCasualties\\": $(parse.defenderFighterCasualties), \\"attackerId\\": $(parse.attackerId), \\"defenderId\\": $(parse.defenderId), \\"infrastructureDamage\\": $(parse.infrastructureDamage), \\"tankDamage\\": $(parse.tankDamage), \\"cruiseMissileDamage\\": $(parse.cruiseMissileDamage), \\"battleId\\": $(parse.battleId)}"]
    // encode_tx    [type=ethabiencode
    //     abi="fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)"
    //     data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\": $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_data)}"
    //   ]
    // submit_tx    [type=ethtx to="${oracleAddress}" data="$(encode_tx)"]
    //     decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx
    // """
    // `
    // console.log("AIR BATTLE JOB********", airBattleOutputForConsole);
    // const electionOutputForConsole = `
    // type = "directrequest"
    // schemaVersion = 1
    // name = "${jobNameSenate}"
    // externalJobID = "${senateExternalID}"
    // maxTaskDuration = "0s"
    // contractAddress = "${oracleAddress}"
    // observationSource = """
    //     decode_log   [type=ethabidecodelog
    //       abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
    //       data="$(jobRun.logData)"
    //       topics="$(jobRun.logTopics)"]
    //     decode_cbor  [type=cborparse data="$(decode_log.data)"]
    //     fetch        [type=bridge name="senate" requestData="{\\"id\\": $(jobSpec.externalJobID), \\"data\\": $(decode_cbor)}"]
    //     parse       [type=jsonparse path="data" data="$(fetch)"]
    //     encode_data  [type=ethabiencode abi="(bytes memory attackerFighterCasualties, bytes memory attackerBomberCasualties, bytes memory defenderFighterCasualties, uint256 attackerId, uint256 defenderId, uint256 infrastructureDamage, uint256 tankDamage, uint256 cruiseMissileDamage, uint256 battleId)" data="$(parse)"]
    //     encode_tx    [type=ethabiencode
    //         abi="fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)"
    //         data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\": $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_data)}"
    //       ]
    //     submit_tx    [type=ethtx to="${oracleAddress}" data="$(encode_tx)"]
    //     decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx
    // """
    // `
    // console.log("election job for console", electionOutputForConsole)
    // const groundBattleOutputForConsole = `
    // type = "directrequest"
    // schemaVersion = 1
    // name = "${groundBattleName}"
    // externalJobID = "${groundBattleExternalID}"
    // maxTaskDuration = "0s"
    // contractAddress = "${oracleAddress}"
    // observationSource = """
    // decode_log   [type=ethabidecodelog
    //   abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
    //   data="$(jobRun.logData)"
    //   topics="$(jobRun.logTopics)"]
    // decode_cbor  [type=cborparse data="$(decode_log.data)"]
    // fetch        [type=bridge name="ground-battle" requestData="{\\"id\\": $(jobSpec.externalJobID), \\"data\\": $(decode_cbor)}"]
    // parse       [type=jsonparse path="data" data="$(fetch)"]
    // encode_data  [type=ethabiencode abi="(bytes32 requestId, uint256 battleId, uint256 attackerId, uint256 attackerSoldierLosses, uint256 attackerTankLosses, uint256 defenderId, uint256 defenderSoldierLosses, uint256 defenderTankLosses, uint256 warId, bool attackerVictory)" data="{ \\"requestId\\": $(decode_log.requestId), \\"battleId\\": $(parse.attackId), \\"attackerId\\": $(parse.attackerId), \\"attackerSoldierLosses\\": $(parse.attackerSoldierLosses), \\"attackerTankLosses\\": $(parse.attackerTankLosses), \\"defenderId\\": $(parse.defenderId), \\"defenderSoldierLosses\\": $(parse.defenderSoldierLosses), \\"defenderTankLosses\\": $(parse.defenderTankLosses), \\"warId\\": $(parse.warId), \\"attackerVictory\\": $(parse.attackVictory)}"]
    // encode_tx    [type=ethabiencode
    //     abi="fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)"
    //     data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\": $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_data)}"
    //   ]
    // submit_tx    [type=ethtx to="${oracleAddress}" data="$(encode_tx)"]
    //     decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx
    // """
    // `
    // console.log("ground battle job", groundBattleOutputForConsole)
    const navalAttackOutputForConsole = `
      type = "directrequest"
      schemaVersion = 1
      name = "${navalAttackName}"
      externalJobID = "${navalAttackExternalID}"
      maxTaskDuration = "0s"
      contractAddress = "${oracleAddress}"
      observationSource = """
      decode_log   [type=ethabidecodelog
        abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
        data="$(jobRun.logData)"
        topics="$(jobRun.logTopics)"]
      decode_cbor  [type=cborparse data="$(decode_log.data)"]
      fetch        [type=bridge name="naval-attack" requestData="{\\"id\\": $(jobSpec.externalJobID), \\"data\\": $(decode_cbor)}"]
      parse       [type=jsonparse path="data" data="$(fetch)"]
      encode_data  [type=ethabiencode abi="(bytes32 requestId, uint256[] memory attackerLosses, uint256[] memory defenderLosses, uint256 battleId)" data="{ \\"requestId\\": $(decode_log.requestId), \\"attackerLosses\\": $(parse.attackerLosses), \\"defenderLosses\\": $(parse.defenderLosses), \\"battleId\\": $(parse.battleId) }"]
      encode_tx    [type=ethabiencode
          abi="fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)"
          data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\": $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_data)}"
        ]
      submit_tx    [type=ethtx to="${oracleAddress}" data="$(encode_tx)"]
    
          decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx
      """
    `;
    console.log("naval attack job", navalAttackOutputForConsole);
    // const outputForConsole = `
    //       type = "directrequest"
    //       schemaVersion = 1
    //       name = "Get > Uint256: 387"
    //       externalJobID = "227d4ec0-9c73-4ed0-9693-fea49eab903a"
    //       maxTaskDuration = "0s"
    //       contractAddress = "0x1a77e3cF48eCb31Af9645b3b82e99B1c6326d6bb"
    //       observationSource = """
    //           decode_log   [type=ethabidecodelog
    //                         abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
    //                         data="$(jobRun.logData)"
    //                         topics="$(jobRun.logTopics)"]
    //           decode_cbor  [type=cborparse data="$(decode_log.data)"]
    //           fetch        [type=bridge name="multiply" requestData="{\\"requestId\\": $(decode_log.requestId), \\"data\\": { \\"numberToMultiply\\": $(decode_cbor.inputNumber)}}"]
    //           parse        [type=jsonparse path="data,product" data="$(fetch)"]
    //           encode_data  [type=ethabiencode abi="(bytes32 requestId, bytes value)" data="{\\"requestId\\": $(decode_log.requestId), \\"value\\": $(parse)}"]
    //           encode_tx    [type=ethabiencode
    //                         abi="fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)"
    //                         data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\": $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_data)}"
    //                       ]
    //           submit_tx    [type=ethtx to="0x1a77e3cF48eCb31Af9645b3b82e99B1c6326d6bb" data="$(encode_tx)"]
    //           decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx
    //       """
    // `
    // console.log(outputForConsole)
    // const defaultJob = `{
    //   "operationName": "CreateJob",
    //   "variables": {
    //     "input": {
    //       "TOML": "type = \\"directrequest\\"\\n" +
    //               "schemaVersion = 1\\n" +
    //               "name = \\"${jobName}\\"\\n" +
    //               "# Optional External Job ID: Automatically generated if unspecified\\n" +
    //               "externalJobID = \\"${externalID}\\"\\n" +
    //               "contractAddress = \\"${oracleAddress}\\"\\n" +
    //               "maxTaskDuration = \\"0s\\"\\n" +
    //               "observationSource = \\"\\"\\"\\n" +
    //               "  decode_log   [type=\\"ethabidecodelog\\"\\n" +
    //               "                abi=\\"OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)\\"\\n" +
    //               "                data=\\"$(jobRun.logData)\\"\\n" +
    //               "                topics=\\"$(jobRun.logTopics)\\"]\\n\\n" +
    //               "  decode_cbor  [type=\\"cborparse\\" data=\\"$(decode_log.data)\\"]\\n" +
    //               "  fetch        [type=\\"http\\" method=GET url=\\"$(decode_cbor.get)\\" allowUnrestrictedNetworkAccess=\\"true\\"]\\n" +
    //               "  parse        [type=\\"jsonparse\\" path=\\"$(decode_cbor.path)\\" data=\\"$(fetch)\\"]\\n" +
    //               "  multiply     [type=\\"multiply\\" input=\\"$(parse)\\" times=100]\\n" +
    //               "  encode_data  [type=\\"ethabiencode\\" abi=\\"(uint256 value)\\" data=\\"{ \\\\\\\\\\"value\\\\\\\\\\": $(multiply) }\\"]\\n" +
    //               "  encode_tx    [type=\\"ethabiencode\\"\\n" +
    //               "                abi=\\"fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)\\"\\n" +
    //               "                data=\\"{\\\\\\\\\\"requestId\\\\\\\\\\": $(decode_log.requestId), \\\\\\\\\\"payment\\\\\\\\\\": $(decode_log.payment), \\\\\\\\\\"callbackAddress\\\\\\\\\\": $(decode_log.callbackAddr), \\\\\\\\\\"callbackFunctionId\\\\\\\\\\": $(decode_log.callbackFunctionId), \\\\\\\\\\"expiration\\\\\\\\\\": $(decode_log.cancelExpiration), \\\\\\\\\\"data\\\\\\\\\\": $(encode_data)}\\"\\n" +
    //               "               ]\\n" +
    //               "  submit_tx    [type=\\"ethtx\\" to=\\"${oracleAddress}\\" data=\\"$(encode_tx)\\"]\\n\\n" +
    //               "  decode_log -> decode_cbor -> fetch -> parse -> multiply -> encode_data -> encode_tx -> submit_tx\\n\\"\\"\\"\\n"
    //     }
    //   },
    //   "query": "mutation CreateJob($input: CreateJobInput!) {\\n" +
    //            "  createJob(input: $input) {\\n" +
    //            "    ... on CreateJobSuccess {\\n" +
    //            "      job {\\n" +
    //            "        id\\n" +
    //            "        __typename\\n" +
    //            "      }\\n" +
    //            "      __typename\\n" +
    //            "    }\\n" +
    //            "    ... on InputErrors {\\n" +
    //            "      errors {\\n" +
    //            "        path\\n" +
    //            "        message\\n" +
    //            "        code\\n" +
    //            "        __typename\\n" +
    //            "      }\\n" +
    //            "      __typename\\n" +
    //            "    }\\n" +
    //            "    __typename\\n" +
    //            "  }\\n" +
    //            "}\\n"
    // }`;
    // const testJob = `{
    //   "operationName":"CreateJob",
    //   "variables":{
    //     "input":{
    //       "TOML":  
    //         "type = "directrequest"
    //         schemaVersion = 1
    //         name = "Soccer-Data-EA"
    //         contractAddress = "0xA74F1E1Bb6204B9397Dac33AE970E68F8aBC7651"
    //         maxTaskDuration = "0s"
    //         observationSource = """
    //             decode_log   [type=ethabidecodelog
    //                           abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
    //                           data="$(jobRun.logData)"
    //                           topics="$(jobRun.logTopics)"]
    //             decode_cbor  [type=cborparse data="$(decode_log.data)"]
    //             fetch        [type=bridge name="soccer-data" requestData="{\\"id\\": $(jobSpec.externalJobID), \\"data\\": { \\"playerId\\": $(decode_cbor.playerId)}}"]
    //             parse        [type=jsonparse path="data,0,Games" data="$(fetch)"]
    //             encode_data  [type=ethabiencode abi="(uint256 value)" data="{ \\"value\\": $(parse) }"]
    //             encode_tx    [type=ethabiencode
    //                           abi="fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)"
    //                           data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\": $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_data)}"
    //                         ]
    //             submit_tx    [type=ethtx to="0xA74F1E1Bb6204B9397Dac33AE970E68F8aBC7651" data="$(encode_tx)"]
    //             decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx
    //         """"
    //       },
    //       "query":"mutation CreateJob($input: CreateJobInput!) {\\n  createJob(input: $input) {\\n    ... on CreateJobSuccess {\\n      job {\\n        id\\n        __typename\\n      }\\n      __typename\\n    }\\n    ... on InputErrors {\\n      errors {\\n        path\\n        message\\n        code\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"
    //     },
    //   }`;
    let jobDesc;
    switch (jobType) {
        case direct:
            jobDesc = defaultJob;
            break;
        case cron:
            jobDesc = `{"operationName":"CreateJob","variables":{"input":{"TOML":"type = \\"cron\\"\\nschemaVersion = 1\\nname = \\"${jobName}\\"\\nexternalJobID = \\"${externalID}\\"\\ncontractAddress = \\"${oracleAddress}\\"\\nmaxTaskDuration = \\"0s\\"\\nschedule = \\"CRON_TZ=UTC * */20 * * * *\\"\\nobservationSource = \\"\\"\\"\\n    fetch    [type=\\"http\\" method=GET url=\\"https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD\\"]\\n    parse    [type=\\"jsonparse\\" path=\\"RAW,ETH,USD,PRICE\\"]\\n    multiply [type=\\"multiply\\" times=100]\\n\\n    fetch -> parse -> multiply\\n\\"\\"\\""}},"query":"mutation CreateJob($input: CreateJobInput!) {\\n  createJob(input: $input) {\\n    ... on CreateJobSuccess {\\n      job {\\n        id\\n        __typename\\n      }\\n      __typename\\n    }\\n    ... on InputErrors {\\n      errors {\\n        path\\n        message\\n        code\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`;
            break;
        default:
            jobDesc = defaultJob;
    }
    try {
        console.info("\nCreating Job...\n");
        // const data = await axios.request<any, QueryResponse>({
        //   url: "http://127.0.0.1:6688/query",
        //   headers: {
        //     "content-type": "application/json",
        //     cookie: `blocalauth=localapibe315fd0c14b5e47:; isNotIncognito=true; _ga=GA1.1.2055974768.1644792885; ${authenticationToken}`,
        // Referer: "http://127.0.0.1:6688/jobs/new",
        //   },
        //   method: "POST",
        //   data: jobDesc,
        // });
        // const dataToWrite = `export const jobId = "${externalID}";\n`;
        // const dataToWrite = `export const jobId = "${airBattleExternalID}";\n`;
        // const dataToWrite = `export const jobId = "${senateExternalID}";\n`;
        const dataToWrite = `export const jobId = "${navalAttackExternalID}";\n`;
        // const dataToWrite = `export const jobId = "${groundBattleExternalID}";\n`;
        // Define the path
        const outputPath = path_1.default.join(__dirname, "..", 'jobMetadata.ts');
        // Writing to the file
        fs_1.default.writeFile(outputPath, dataToWrite, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            }
            else {
                console.log(`Data successfully written to ${outputPath}`);
            }
        });
        console.table({
            Status: "Success",
            // Error: data.errors != null ? data?.errors[0]?.message : null,
            // JobID: data?.data?.data?.createJob?.job?.id,
            // ExternalID: externalID,
        });
    }
    catch (e) {
        console.log("Could not create job");
        console.error(e);
    }
};
exports.createJob = createJob;
