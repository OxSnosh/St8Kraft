"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const abiDecoder = hardhat_1.ethers.utils.defaultAbiCoder;
describe("Encode", function () {
    let encode;
    let test;
    beforeEach(async function () {
        const Encode = await hardhat_1.ethers.getContractFactory("Encode");
        encode = await Encode.deploy();
        const Test = await hardhat_1.ethers.getContractFactory("Test");
        test = await Test.deploy();
    });
    function decodeBase64ToUint256Array(base64String) {
        // Decode Base64 string into a Buffer
        const buffer = Buffer.from(base64String, 'base64');
        // Ensure the buffer length is divisible by 32 (256 bits per integer)
        const uint256Size = 32; // 256 bits = 32 bytes
        if (buffer.length % uint256Size !== 0) {
            throw new Error("Invalid Base64 string: Buffer length must be a multiple of 32.");
        }
        // Convert the buffer into an array of 256-bit unsigned integers
        const uint256Array = [];
        for (let i = 0; i < buffer.length; i += uint256Size) {
            const chunk = buffer.subarray(i, i + uint256Size); // Use subarray instead of slice
            const bigIntValue = BigInt(`0x${chunk.toString('hex')}`); // Convert to BigInt
            uint256Array.push(bigIntValue);
        }
        return uint256Array;
    }
    function decodeBase64ToUint8Array(base64String, length) {
        // Decode Base64 string to a Buffer
        const buffer = Buffer.from(base64String, 'base64');
        // Convert Buffer to Uint8Array
        const uint8Array = new Uint8Array(buffer);
        // Ensure the Uint8Array has at least the desired length
        if (uint8Array.length < length) {
            throw new Error(`Decoded data is shorter than the specified length: ${length}`);
        }
        // Return the array truncated to the specified length
        return uint8Array.slice(-length);
    }
    describe("Encode Tests", function () {
        it("test the outputs of encoded values", async function () {
            var encodedValues = await encode.encodeArray();
            // console.log(encodedValues[0])
            // console.log(encodedValues[1])
            var encoded = encodedValues[0];
            var abiDecode = abiDecoder.decode(["uint256[]"], encoded);
            console.log(abiDecode[0][8].toNumber()); // returns 20
        });
        it("tests the encode function to uint256", async function () {
            // Example usage
            const base64String = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABisjLJdFLwlQyU4lOf3H5p0hFmETz3qby5myIKP+XXIK4mic1KhOI60vVkAE8ckBPpWJ0mC95jgKujyn4J5N9Ay5i3hjMJn6Nu2LhoDE+AkmieHgQIDrnLsHfKOKFNfjhEBarTLhrbrIm7fxduM4uPxumUyiEMm7e9yiSbRllCJQBM3nYu8ItrbF3tjoxMCz9OXJrXNCyI/Mk2gbRYi3PwVFizDC1yv9LGMXMEpFlOy6/l9ynTERtl/cOjO9SOVDLQ==';
            const output = decodeBase64ToUint256Array(base64String);
            console.log(output.map((bigInt) => bigInt.toString()));
        });
        it("tests the encode function to uint8", async function () {
            // Example usage
            const defenderFighters = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';
            const defenderFightersOutput = decodeBase64ToUint8Array(defenderFighters, 9);
            console.log(defenderFightersOutput.map((bigInt) => bigInt));
            // Example usage
            const attackerBombers = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABw==';
            const attackerBombersOutput = decodeBase64ToUint8Array(attackerBombers, 9);
            console.log(attackerBombersOutput.map((bigInt) => bigInt));
            // Example usage
            const attackerFighters = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADw==';
            const attackerFightersOutput = decodeBase64ToUint8Array(attackerFighters, 9);
            console.log(attackerFightersOutput.map((bigInt) => bigInt));
            // Example usage
            const base64String = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABg==';
            function decodeBase64ToSpecificArray(base64String) {
                // Decode Base64 string to Buffer
                const buffer = Buffer.from(base64String, 'base64');
                // Convert Buffer to Uint8Array
                const uint8Array = new Uint8Array(buffer);
                // Process the array to match the desired output
                const result = [];
                for (let i = 0; i < uint8Array.length; i++) {
                    const value = uint8Array[i];
                    if (value !== 0) { // Include only non-zero values
                        result.push(value);
                    }
                }
                return result;
            }
            const outputRaw = decodeBase64ToSpecificArray(base64String);
            const output = outputRaw.slice(1);
            console.log("output", output);
        });
        it("runs another encode test", async function () {
            function decodeBase64ToBigIntArray(base64String) {
                // Decode the Base64 string to a Buffer
                const buffer = Buffer.from(base64String, 'base64');
                // Define the size of each 256-bit number (32 bytes)
                const chunkSize = 32;
                // Start processing from the first valid 32-byte chunk
                const startIndex = buffer.length % chunkSize;
                // Extract the 32-byte chunks as BigInt values
                const bigIntArray = [];
                for (let i = startIndex; i < buffer.length; i += chunkSize) {
                    const chunk = buffer.subarray(i, i + chunkSize); // Get a 32-byte chunk
                    const bigIntValue = BigInt(`0x${chunk.toString('hex')}`); // Convert the chunk to BigInt
                    bigIntArray.push(bigIntValue);
                }
                // Return only the first 10 numbers
                return bigIntArray.slice(2, 12);
            }
            // Example usage
            const base64String = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACisjLJdFLwlQyU4lOf3H5p0hFmETz3qby5myIKP+XXIK4mic1KhOI60vVkAE8ckBPpWJ0mC95jgKujyn4J5N9Ay5i3hjMJn6Nu2LhoDE+AkmieHgQIDrnLsHfKOKFNfjhEBarTLhrbrIm7fxduM4uPxumUyiEMm7e9yiSbRllCJQBM3nYu8ItrbF3tjoxMCz9OXJrXNCyI/Mk2gbRYi3PwVFizDC1yv9LGMXMEpFlOy6/l9ynTERtl/cOjO9SOVDLb/TWOk/GNo+0nbDr9vboAuPC2AIoDR2pqhr1jIO5pOLvN2la10IRm7EYsu+Ct+lfLChX8yJQO9o9wLyG3h7yTWRI48w8obJocbpAcTto7IUw4HIRuPb5I35XCFIjo4f23SwUpLR1LK0i2UmGwcJnSQkS8sGnxONmmv9z3dr7KxM';
            const result = decodeBase64ToBigIntArray(base64String);
            console.log(result);
        });
    });
    it("tests how to use storage when adding a struct to mapping", async function () {
        await test.testStruct(5, 2000, 100);
        const returnedData = await test.returnArmy(5);
        console.log(returnedData[0].toNumber(), "troops");
        console.log(returnedData[1].toNumber(), "tanks");
    });
    it("tests the navy battle function", async function () {
        let randomNumbers = [
            61066341240856734250200229908154867864480630679181913661669668597419326467371,
            99693343276258175943276224455600693875804524070548600678645430786866646426494,
            78181099417206407199906070499907499211714970279124946836669599877043606637157,
            109807013508035561679566837496832180065526112186273413491290749999230507670482,
            86256996385176994882702380557601069724777981298349890779122761479716089226577,
            107585792720183220396831004431233904358758893557258134895825952452247624881248
        ];
        let attackerChances = [44, 84, 116, 132];
        let attackerTypes = [3, 4, 5, 7];
        let defenderChances = [44, 84, 116, 132];
        let defenderTypes = [3, 4, 5, 7];
        function createChunks(numbers) {
            let chunks = []; // Declare chunks outside the loop to store all results
            for (let i = 0; i < numbers.length; i++) { // Iterate over all numbers
                let numberToSlice = BigInt(numbers[i]).toString(); // Convert the number to BigInt and then to a string
                let sliceNumber = 0;
                for (let j = 0; j < 5; j++) { // Extract 5 chunks per number
                    let chunk = numberToSlice.slice(sliceNumber, sliceNumber + 10);
                    if (chunk.length === 10) { // Ensure the chunk has 10 digits
                        chunks.push(chunk);
                    }
                    sliceNumber += 10; // Move to the next slice
                }
            }
            return chunks;
        }
        let chunks = createChunks(randomNumbers);
        let corvetteTargetSize = 15;
        let landingShipTargetSize = 13;
        let battleshipTargetSize = 11;
        let cruiserTargetSize = 10;
        let frigateTargetSize = 8;
        let destroyerTargetSize = 5;
        let submarineTargetSize = 4;
        let aircraftCarrierTargetSize = 1;
        function amountToDecreaseFunction(type) {
            let amountToDecrease = 0;
            if (type == 1) {
                amountToDecrease = corvetteTargetSize;
            }
            else if (type == 2) {
                amountToDecrease = landingShipTargetSize;
            }
            else if (type == 3) {
                amountToDecrease = battleshipTargetSize;
            }
            else if (type == 4) {
                amountToDecrease = cruiserTargetSize;
            }
            else if (type == 5) {
                amountToDecrease = frigateTargetSize;
            }
            else if (type == 6) {
                amountToDecrease = destroyerTargetSize;
            }
            else if (type == 7) {
                amountToDecrease = submarineTargetSize;
            }
            else if (type == 8) {
                amountToDecrease = aircraftCarrierTargetSize;
            }
            return amountToDecrease;
        }
        function shipCount(typeArray, chanceArray) {
            let shipCount = 0;
            for (let i = 0; i < typeArray.length; i++) {
                let type = typeArray[i];
                let divisor = 0;
                if (type == 1) {
                    divisor = corvetteTargetSize;
                }
                else if (type == 2) {
                    divisor = landingShipTargetSize;
                }
                else if (type == 3) {
                    divisor = battleshipTargetSize;
                }
                else if (type == 4) {
                    divisor = cruiserTargetSize;
                }
                else if (type == 5) {
                    divisor = frigateTargetSize;
                }
                else if (type == 6) {
                    divisor = destroyerTargetSize;
                }
                else if (type == 7) {
                    divisor = submarineTargetSize;
                }
                else if (type == 8) {
                    divisor = aircraftCarrierTargetSize;
                }
                let numberToDivide;
                let shipToAdd;
                if (i === 0) {
                    numberToDivide = chanceArray[i];
                }
                else {
                    numberToDivide = chanceArray[i] - chanceArray[i - 1];
                }
                shipToAdd = numberToDivide / divisor;
                shipCount += shipToAdd;
            }
            return shipCount;
        }
        let shipCountAttacker = shipCount(attackerTypes, attackerChances);
        console.log(shipCountAttacker);
        let shipCountdefender = shipCount(defenderTypes, defenderChances);
        console.log(shipCountdefender);
        let totalShipCount = (shipCountAttacker + shipCountdefender);
        function calculateLosses(totalShips) {
            let numberBetweenZeroAndTwo = (Number(chunks[0]) % 3);
            console.log(numberBetweenZeroAndTwo);
            let losses;
            if (totalShips < 4) {
                losses = 1;
            }
            else if (totalShips <= 10) {
                losses = (1 + numberBetweenZeroAndTwo);
            }
            else if (totalShips <= 30) {
                losses = (2 + numberBetweenZeroAndTwo);
            }
            else if (totalShips <= 50) {
                losses = (3 + numberBetweenZeroAndTwo);
            }
            else if (totalShips <= 70) {
                losses = (4 + numberBetweenZeroAndTwo);
            }
            else if (totalShips <= 100) {
                losses = (5 + numberBetweenZeroAndTwo);
            }
            else {
                losses = (6 + numberBetweenZeroAndTwo);
            }
            return losses;
        }
        let losses = calculateLosses(totalShipCount);
        console.log(losses);
        function calulateBattleResults(losses, attackerChances, attackerTypes, defenderChances, defenderTypes) {
            let attackerLosses = [];
            let defenderLosses = [];
            console.log("here?");
            for (let i = 1; i <= losses; i++) {
                let randomNumber = Number(chunks[i]);
                let totalStrength = (attackerChances[attackerChances.length - 1] + defenderChances[defenderChances.length - 1]);
                let selector = (randomNumber % totalStrength);
                console.log(totalStrength, "totalStrength");
                console.log(randomNumber, "randomNumber");
                console.log(selector, "selector");
                if (selector < attackerChances[attackerChances.length - 1]) {
                    //loss for defender
                    console.log("defender loss");
                    let secondRandomNumber = Number(chunks[i + 10]);
                    let shipSelector = (secondRandomNumber % defenderChances[defenderChances.length - 1]);
                    let shipType;
                    let amountToDecrease = undefined;
                    let k = undefined;
                    let ranAlready = false;
                    if (ranAlready == false) {
                        for (let j = 0; j < defenderChances.length; j++) {
                            if (shipSelector < defenderChances[j]) {
                                defenderLosses.push(defenderTypes[j]);
                                shipType = defenderTypes[j];
                                amountToDecrease = amountToDecreaseFunction(shipType);
                                k = j;
                                break;
                            }
                        }
                        console.log(k, "k");
                        if (k !== undefined && amountToDecrease !== undefined) {
                            for (let index = k; index < defenderChances.length; index++) {
                                if (defenderChances[k] >= randomNumber) {
                                    defenderChances[k] -= amountToDecrease;
                                }
                            }
                            ranAlready = true;
                        }
                    }
                    else {
                        console.error("k or amountToDecrease is undefined. Skipping iteration.");
                    }
                }
                else {
                    //loss for attacker
                    console.log("attacker loss");
                    let secondRandomNumber = Number(chunks[i + 10]);
                    let shipSelector = (secondRandomNumber % attackerChances[attackerChances.length - 1]);
                    let shipType;
                    let amountToDecrease = undefined;
                    let k = undefined;
                    let ranAlready = false;
                    if (ranAlready == false) {
                        for (let j = 0; j < attackerChances.length; j++) {
                            if (shipSelector < attackerChances[j]) {
                                attackerLosses.push(attackerTypes[j]);
                                shipType = attackerTypes[j];
                                amountToDecrease = amountToDecreaseFunction(shipType);
                                k = j;
                                break;
                            }
                        }
                        console.log(k, "k");
                        if (k !== undefined && amountToDecrease !== undefined) {
                            for (let index = k; index < attackerChances.length; index++) {
                                if (attackerChances[k] >= randomNumber) {
                                    attackerChances[k] -= amountToDecrease;
                                }
                            }
                            ranAlready = true;
                        }
                        else {
                            console.error("k or amountToDecrease is undefined. Skipping iteration.");
                        }
                    }
                }
            }
            return [attackerLosses, defenderLosses];
        }
        let results = calulateBattleResults(losses, attackerChances, attackerTypes, defenderChances, defenderTypes);
        console.log(results[0]);
        console.log(results[1]);
    });
});
