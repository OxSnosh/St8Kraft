// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat")
const { INITIAL_SUPPLY } = require("../helper-hardhat-config")

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    // We get the contract to deploy
    const WarBucks = await hre.ethers.getContractFactory("WarBucks")
    const warbucks = await WarBucks.deploy(INITIAL_SUPPLY)

    await warbucks.deployed()
    console.log(`WarBuks token deployed to ${warbucks.address}`)

    const MetaNatonsGovToken = await hre.ethers.getContractFactory("MetaNationsGovToken")
    const metanationsgvtoken = await MetaNatonsGovToken.deploy(INITIAL_SUPPLY)

    await metanationsgvtoken.deployed()
    console.log(`MetaNationsGovToken deployed to ${metanationsgvtoken.address}`)

    const CountryFactory = await hre.ethers.getContractFactory("CountryFactory")
    const countryfactory = await CountryFactory.deploy()

    await countryfactory.deployed()
    console.log(`CountryFactory deployed to ${countryfactory.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})