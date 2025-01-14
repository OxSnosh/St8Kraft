import { ethers, artifacts } from "hardhat";
import { Defender } from "@openzeppelin/defender-sdk"
import { CountryMinter, SpyOperationsContract } from "../typechain-types";
import { HARDHAT } from "../script-metadata.json"

import * as dotenv from 'dotenv';
import { Signer } from "ethers";
import Provider from '@ethersproject/providers';


dotenv.config()

type Input = {
    signature: string,
    messageHash: string,
    callerNationId: number,
    defenderNationId: number
}

export async function relaySpyOperation( data : Input ) {
    
    console.log("arrived in relayer")

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

    console.log()

    var attackerSuccessScore = await spyoperations.getAttackerSuccessScore(data.callerNationId)
    var defenderSuccessScore = await spyoperations.getDefenseSuccessScore(data.defenderNationId)

    var strengthTotal = (attackerSuccessScore.toNumber() + defenderSuccessScore.toNumber())
    console.log(attackerSuccessScore.toNumber())
    console.log(defenderSuccessScore.toNumber())
    console.log(strengthTotal)

    console.log("did we arrive here?");

    const randomNumber = Math.floor(Math.random() * strengthTotal);

    console.log(randomNumber)

    let success: boolean
    let attackType: number
    let attackerId: number
    


    if( randomNumber < attackerSuccessScore.toNumber()) {
        console.log("attackSuccess")

    }

    await spyoperations.spyAttack(1, true)




    
}