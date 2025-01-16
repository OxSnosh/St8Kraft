import { ethers, artifacts } from "hardhat";
import { Defender } from "@openzeppelin/defender-sdk"
import { CountryMinter, NationStrengthContract, SpyOperationsContract } from "../typechain-types";
import { HARDHAT } from "../script-metadata.json"

import * as dotenv from 'dotenv';
import { Signer } from "ethers";
import Provider from '@ethersproject/providers';


dotenv.config()

type Input = {
    signature: string,
    messageHash: string,
    callerNationId: number,
    defenderNationId: number,
    attackType: number
}

export async function relaySpyOperation( data : Input ) {

    const signers = await ethers.getSigners();
    const recoveredAddress = await ethers.utils.recoverAddress(data.messageHash, data.signature);
    console.log(recoveredAddress)
    console.log(signers[1].address)

    let mode = "localhost"

    if(mode === "localhost") {
        if(recoveredAddress != signers[1].address) {
            throw new Error("caller of relayer not signer of message");
        }
    }
    
    let minterProvider
    let signer

    if(mode === "production") {
        let countryMinterAbi = HARDHAT.countryminter.ABI
        let countryMinterAddress = HARDHAT.countryminter.address
        let url = process.env.URL_FOR_RELAYER
        minterProvider = new ethers.providers.JsonRpcProvider(url)
        let minter = new ethers.Contract(countryMinterAddress, countryMinterAbi, minterProvider) as CountryMinter
        
        let owner = await minter.checkOwnership(data.callerNationId, recoveredAddress)

        if(!owner) {
            throw new Error("caller of relayer not signer of message production")
        }
    }   
    
    let provider
    
    if (mode === "localhost") {
        const signers = await ethers.getSigners();
        let signer0PrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
        provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
        signer = new ethers.Wallet(signer0PrivateKey, provider)
    } else if (mode === "production") {
        const credentials = {
            relayerApiKey: process.env.DEFENDER_API_KEY as string,
            realyerApiSecret: process.env.DEFENDER_API_SECRET as string,
        };
        let client = new Defender(credentials)
        provider = client.relaySigner.getProvider()
        signer = await client.relaySigner.getSigner(provider, { speed: 'fast' })
    }

    let spyOperationsAbi = HARDHAT.spyoperationscontract.ABI
    let spyOperationsAddress = HARDHAT.spyoperationscontract.address

    const spyoperations = new ethers.Contract(spyOperationsAddress, spyOperationsAbi, signer) as SpyOperationsContract

    var attackerSuccessScore = await spyoperations.getAttackerSuccessScore(data.callerNationId)
    var defenderSuccessScore = await spyoperations.getDefenseSuccessScore(data.defenderNationId)

    var strengthTotal = (attackerSuccessScore.toNumber() + defenderSuccessScore.toNumber())
    // console.log(attackerSuccessScore.toNumber())
    // console.log(defenderSuccessScore.toNumber())
    // console.log(strengthTotal)

    const randomNumber = Math.floor(Math.random() * strengthTotal);

    console.log(randomNumber)

    let success: boolean
    let attackType: number = data.attackType
    let attackerId: number
    let defenderId: number = data.defenderNationId
    let cost: number = 0
 
    const nationStrengthAddress = HARDHAT.nationtrengthcontract.address;
    const nationsStrengthAbi = HARDHAT.nationtrengthcontract.ABI;
    const nationStrengthContract = new ethers.Contract(nationStrengthAddress, nationsStrengthAbi, provider) as NationStrengthContract

    let defenderStrengthRaw = await nationStrengthContract.getNationStrength(defenderId)    
    let defenderStrength = defenderStrengthRaw.toNumber()

    if (attackType > 13 || attackType < 1) {
        throw new Error("attack type must be integer between 1 and 13")
    }

    if (attackType == 1) {
        cost = (100000 + defenderStrength)
    } else if (attackType == 2) {
        cost = (100000 + (defenderStrength * 2))
    } else if (attackType == 3) {
        cost = (100000 + (defenderStrength * 3))
    } else if (attackType == 4) {
        cost = (100000 + (defenderStrength * 3))
    } else if (attackType == 5) {
        cost = (100000 + (defenderStrength * 3))
    } else if (attackType == 6) {
        cost = (150000 + defenderStrength)
    } else if (attackType == 7) {
        cost = (150000 + (defenderStrength * 5))
    } else if (attackType == 8) {
        cost = (250000 + (defenderStrength * 2))
    } else if (attackType == 9) {
        cost = (300000 + (defenderStrength * 2))
    } else if (attackType == 10) {
        cost = (100000 + (defenderStrength * 20))
    } else if (attackType == 11) {
        cost = (300000 + (defenderStrength * 15))
    } else if (attackType == 12) {
        cost = (500000 + (defenderStrength * 5))
    } else if (attackType == 13) {
        cost = (500000 + (defenderStrength * 15))
    }
    
    if( randomNumber < attackerSuccessScore.toNumber()) {
        console.log("attackSuccess")
        success = true
        attackerId = 0
        defenderId = data.defenderNationId
    } else {
        console.log("spy attack thwarted")
        success = false
        attackerId = data.callerNationId
        defenderId = data.defenderNationId
    }
    const randomNumberForDamages : number = Math.floor(Math.random() * 9e13) + 1e13;

    // console.log("randomNumberForDamages", randomNumberForDamages)

    let defenderCheck = spyoperations.checkSpyOperation(defenderId, attackType)

    if (!defenderCheck) {
        throw new Error("cannot conduct spy operation of this type at this time");
    }

    await spyoperations.spyAttack(success, attackType, defenderId, attackerId, cost, randomNumberForDamages)
    
}