import { ethers } from "hardhat"
import { expect } from "chai"
import { TreasuryContract, WarBucks, CountryMinter, Encode } from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

const abiDecoder = ethers.utils.defaultAbiCoder

describe("Encode", function () {
  
    let encode : Encode;
    
    beforeEach(async function () {
        const Encode = await ethers.getContractFactory("Encode")
        encode = await Encode.deploy() as Encode
    });

    function decodeBase64ToUint256Array(base64String: string) {
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

    function decodeBase64ToUint8Array(base64String: string, length: number): Uint8Array {
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
        var encodedValues : any = await encode.encodeArray()
        // console.log(encodedValues[0])
        // console.log(encodedValues[1])
        var encoded = encodedValues[0]
        var abiDecode = abiDecoder.decode(["uint256[]"], encoded)
        console.log(abiDecode[0][8].toNumber()) // returns 20
      });

      it("tests the encode function to uint256", async function () {
        // Example usage
        const base64String =
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABisjLJdFLwlQyU4lOf3H5p0hFmETz3qby5myIKP+XXIK4mic1KhOI60vVkAE8ckBPpWJ0mC95jgKujyn4J5N9Ay5i3hjMJn6Nu2LhoDE+AkmieHgQIDrnLsHfKOKFNfjhEBarTLhrbrIm7fxduM4uPxumUyiEMm7e9yiSbRllCJQBM3nYu8ItrbF3tjoxMCz9OXJrXNCyI/Mk2gbRYi3PwVFizDC1yv9LGMXMEpFlOy6/l9ynTERtl/cOjO9SOVDLQ==';

        const output = decodeBase64ToUint256Array(base64String);

        console.log(output.map((bigInt) => bigInt.toString()));
      })

      it("tests the encode function to uint8", async function () {
        // Example usage
        const defenderFighters = 
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=='
        const defenderFightersOutput = decodeBase64ToUint8Array(defenderFighters, 9);

        console.log(defenderFightersOutput.map((bigInt) => bigInt));

        // Example usage
        const attackerBombers = 
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABw=='
        const attackerBombersOutput = decodeBase64ToUint8Array(attackerBombers, 9);

        console.log(attackerBombersOutput.map((bigInt) => bigInt));

        // Example usage
        const attackerFighters = 
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADw=='
        const attackerFightersOutput = decodeBase64ToUint8Array(attackerFighters, 9);

        console.log(attackerFightersOutput.map((bigInt) => bigInt));

        
        // Example usage
        const base64String = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABg==';

        function decodeBase64ToSpecificArray(base64String: string): number[] {
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
      })
    });
  });