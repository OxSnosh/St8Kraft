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

    const Infrastructure = await hre.ethers.getContractFactory("InfrastructureContract")
    const infrastructure = await Infrastructure.deploy()
    await infrastructure.deployed()
    console.log(`Infrastructure deployed to ${infrastructure.address}`) 

    const Resources = await hre.ethers.getContractFactory("ResourcesContract")
    const resources = await Resources.deploy()
    await resources.deployed()
    console.log(`Market deployed to ${resources.address}`) 

    const Improvements = await hre.ethers.getContractFactory("ImprovementsContract")
    const improvements = await Improvements.deploy()
    await improvements.deployed()
    console.log(`Market deployed to ${improvements.address}`) 

    const Wonders = await hre.ethers.getContractFactory("WondersContract")
    const wonders = await Wonders.deploy()
    await wonders.deployed()
    console.log(`Market deployed to ${wonders.address}`) 

    const Military = await hre.ethers.getContractFactory("MilitaryContract")
    const military = await Military.deploy()
    await military.deployed()
    console.log(`Military deployed to ${military.address}`) 

    const Treasury = await hre.ethers.getContractFactory("TreasuryContract")
    const treasury = await Treasury.deploy(warbucks.address)
    await treasury.deployed()
    console.log(`Treasury deployed to ${treasury.address}`) 

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
        improvements.address,
        wonders.address
        )
    await countryminter.deployed()
    await countryminter.constructorContinued(        
        military.address,
        forces.address,
        navy.address,
        fighters.address,
        bombers.address
        )
    console.log(`CountryMinter deployed to ${countryminter.address}`)

}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
