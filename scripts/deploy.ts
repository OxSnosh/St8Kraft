// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from "hardhat"
import { INITIAL_SUPPLY } from "../helper-hardhat-config"

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    await hre.run('compile');

    // We get the contract to deploy
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

    const CountryMinter = await hre.ethers.getContractFactory("CountryMinter")
    const countryminter = await CountryMinter.deploy(warbucks.address)
    await countryminter.deployed()
    console.log(`CountryMinter deployed to ${countryminter.address}`)

    const ICountryMinter = await hre.ethers.getContractFactory("ICountryMinter")
    const icountryminter = await ICountryMinter.deploy()
    await icountryminter.deployed()
    console.log(`CountryMinter deployed to ${icountryminter.address}`)

    const CommodityMarketplace = await hre.ethers.getContractFactory(
        "CommodityMarketplace"
    )
    const commoditymarketplace = await CommodityMarketplace.deploy(
        warbucks.address,
        countryminter.address
    )
    await commoditymarketplace.deployed()
    await console.log(`Marketplace deployed to ${commoditymarketplace.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
