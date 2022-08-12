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
    const countryparameter = await CountryParameters.deploy()
    await countryparameter.deployed()
    console.log(`CountryParameters deployed to ${countryparameter.address}`)  
    
    const CountryMinter = await hre.ethers.getContractFactory("CountryMinter")
    const countryminter = await CountryMinter.deploy(warbucks.address, countryparameter.address)
    await countryminter.deployed()
    console.log(`CountryMinter deployed to ${countryminter.address}`)

    // const Marketplace = await hre.ethers.getContractFactory(
    //     "CommodityMarketplace"
    // )
    // const marketplace = await Marketplace.deploy(
    //     warbucks.address,
    //     countryminter.address
    // )
    // await marketplace.deployed()
    // await console.log(`Marketplace deployed to ${marketplace.address}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
