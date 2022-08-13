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

    const Market = await hre.ethers.getContractFactory("MarketContract")
    const market = await Market.deploy()
    await market.deployed()
    console.log(`Market deployed to ${market.address}`) 

    const Military = await hre.ethers.getContractFactory("MilitaryContract")
    const military = await Military.deploy()
    await military.deployed()
    console.log(`Military deployed to ${military.address}`) 

    const Forces = await hre.ethers.getContractFactory("ForcesContract")
    const forces = await Forces.deploy()
    await forces.deployed()
    console.log(`Forces deployed to ${forces.address}`) 

    const Treasury = await hre.ethers.getContractFactory("TreasuryContract")
    const treasury = await Treasury.deploy()
    await treasury.deployed()
    console.log(`Treasury deployed to ${treasury.address}`) 

    const Navy = await hre.ethers.getContractFactory("NavyContract")
    const navy = await Navy.deploy()
    await navy.deployed()
    console.log(`Navy deployed to ${navy.address}`) 

    const Fighters = await hre.ethers.getContractFactory("FightersContract")
    const fighters = await Fighters.deploy()
    await fighters.deployed()
    console.log(`Fighters deployed to ${fighters.address}`) 

    const Bombers = await hre.ethers.getContractFactory("BombersContract")
    const bombers = await Bombers.deploy()
    await bombers.deployed()
    console.log(`Bombers deployed to ${bombers.address}`) 

    const CountryMinter = await hre.ethers.getContractFactory("CountryMinter")
    const countryminter = await CountryMinter.deploy(
        warbucks.address, 
        countryparameters.address, 
        countrysettings.address, 
        infrastructure.address, 
        market.address,
        military.address,
        forces.address,
        treasury.address,
        navy.address,
        fighters.address,
        bombers.address
        )
    await countryminter.deployed()
    console.log(`CountryMinter deployed to ${countryminter.address}`)

}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
