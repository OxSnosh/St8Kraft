import hre from "hardhat"
import { INITIAL_SUPPLY } from "../helper-hardhat-config"

async function main() {

    await hre.run('compile');

    const WarBucks = await hre.ethers.getContractFactory("WarBucks")
    const warbucks = await WarBucks.deploy(INITIAL_SUPPLY)
    await warbucks.deployed()
    console.log(`WarBuks token deployed to ${warbucks.address}`)

    const MetaNatonsGovToken = await hre.ethers.getContractFactory(
        "MetaNationsGovToken"
    )
    const metanationsgvtoken = await MetaNatonsGovToken.deploy(INITIAL_SUPPLY)
    await metanationsgvtoken.deployed()
    console.log(`MetaNationsGovToken deployed to ${metanationsgvtoken.address}`)

    const CountryParameters = await hre.ethers.getContractFactory("CountryParametersContract")
    const countryparameters = await CountryParameters.deploy()
    await countryparameters.deployed()
    console.log(`CountryParameters deployed to ${countryparameters.address}`)  
    
    const CountrySettings = await hre.ethers.getContractFactory("CountrySettingsContract")
    const countrysettings = await CountrySettings.deploy()
    await countrysettings.deployed()
    console.log(`CountrySettings deployed to ${countrysettings.address}`) 

    const Treasury = await hre.ethers.getContractFactory("TreasuryContract")
    const treasury = await Treasury.deploy(warbucks.address)
    await treasury.deployed()
    console.log(`Treasury deployed to ${treasury.address}`) 

    const Infrastructure = await hre.ethers.getContractFactory("InfrastructureContract")
    const infrastructure = await Infrastructure.deploy()
    await infrastructure.deployed()
    console.log(`Infrastructure deployed to ${infrastructure.address}`) 

    const Resources = await hre.ethers.getContractFactory("ResourcesContract")
    const resources = await Resources.deploy()
    await resources.deployed()
    console.log(`Resources deployed to ${resources.address}`) 

    const Improvements2 = await hre.ethers.getContractFactory("ImprovementsContract2")
    const improvements2 = await Improvements2.deploy(treasury.address)
    await improvements2.deployed()
    console.log(`Improvements deployed to ${improvements2.address}`) 

    const Improvements3 = await hre.ethers.getContractFactory("ImprovementsContract3")
    const improvements3 = await Improvements3.deploy(treasury.address)
    await improvements3.deployed()
    console.log(`Improvements deployed to ${improvements3.address}`) 

    const Improvements1 = await hre.ethers.getContractFactory("ImprovementsContract1")
    const improvements1 = await Improvements1.deploy(treasury.address, improvements2.address, improvements3.address)
    await improvements1.deployed()
    console.log(`Improvements deployed to ${improvements1.address}`)

    await improvements2.updateImprovementContract1Address(improvements1.address)
    console.log(`Improvements2 updated with Improvements1 address`)
    await improvements3.updateImprovementContract1Address(improvements1.address)
    console.log(`Improvements3 updated with Improvements1 address`)

    const Wonders2 = await hre.ethers.getContractFactory("WondersContract2")
    const wonders2 = await Wonders2.deploy(treasury.address)
    await wonders2.deployed()
    console.log(`Wonders deployed to ${wonders2.address}`) 

    const Wonders3 = await hre.ethers.getContractFactory("WondersContract3")
    const wonders3 = await Wonders3.deploy(treasury.address)
    await wonders3.deployed()
    console.log(`Wonders deployed to ${wonders3.address}`) 

    const Wonders4 = await hre.ethers.getContractFactory("WondersContract4")
    const wonders4 = await Wonders4.deploy(treasury.address)
    await wonders4.deployed()
    console.log(`Wonders deployed to ${wonders4.address}`) 

    const Wonders1 = await hre.ethers.getContractFactory("WondersContract1")
    const wonders1 = await Wonders1.deploy(treasury.address, wonders2.address, wonders3.address, wonders4.address)
    await wonders1.deployed()
    console.log(`Wonders deployed to ${wonders1.address}`) 

    await wonders2.updateWonderContract1Address(wonders1.address)
    console.log(`wonders1 address set in contract wonders2`)
    await wonders3.updateWonderContract1Address(wonders1.address)
    console.log(`wonders1 address set in contract wonders3`)
    await wonders4.updateWonderContract1Address(wonders1.address)
    console.log(`wonders1 address set in contract wonders4`)

    const Military = await hre.ethers.getContractFactory("MilitaryContract")
    const military = await Military.deploy()
    await military.deployed()
    console.log(`Military deployed to ${military.address}`) 

    const Forces = await hre.ethers.getContractFactory("ForcesContract")
    const forces = await Forces.deploy(treasury.address)
    await forces.deployed()
    console.log(`Forces deployed to ${forces.address}`) 

    const Navy = await hre.ethers.getContractFactory("NavyContract")
    const navy = await Navy.deploy(treasury.address)
    await navy.deployed()
    console.log(`Navy deployed to ${navy.address}`) 

    const Fighters = await hre.ethers.getContractFactory("FightersContract")
    const fighters = await Fighters.deploy(treasury.address)
    await fighters.deployed()
    console.log(`Fighters deployed to ${fighters.address}`) 

    const Bombers = await hre.ethers.getContractFactory("BombersContract")
    const bombers = await Bombers.deploy(treasury.address, fighters.address)
    await bombers.deployed()
    console.log(`Bombers deployed to ${bombers.address}`) 

    const CountryMinter = await hre.ethers.getContractFactory("CountryMinter")
    const countryminter = await CountryMinter.deploy(
        warbucks.address,
        countryparameters.address,
        treasury.address,
        infrastructure.address,
        resources.address,
        military.address,
        forces.address,
        navy.address,
        fighters.address,
        bombers.address,
        )
    await countryminter.deployed()
    await countryminter.constructorContinued(        
        improvements1.address,
        improvements2.address,
        improvements3.address,
        wonders1.address,
        wonders2.address,
        wonders3.address,
        wonders4.address
        )
    console.log(`CountryMinter deployed to ${countryminter.address}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
