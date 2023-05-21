import {ethers} from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import * as metadata from "../script-metadata.json";
import { Signer } from "ethers";
import { TreasuryContract } from '../typechain-types/contracts/Treasury.sol/TreasuryContract';
import { TechnologyMarketContract } from '../typechain-types/contracts/TechnologyMarket.sol/TechnologyMarketContract';
import { ForcesContract } from '../typechain-types/contracts/Forces.sol/ForcesContract';
import { MilitaryContract } from '../typechain-types/contracts/Military.sol/MilitaryContract';
import { WarContract } from '../typechain-types/contracts/War.sol/WarContract';
import { CountryMinter } from '../typechain-types/contracts/CountryMinter';
import { InfrastructureMarketContract } from "../typechain-types";

const initiateSpyOperationTest = async () => {

    let signers = await ethers.getSigners();
    let signer0 = await ethers.getSigner("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266") as any
    let signer1 = await ethers.getSigner("0x70997970C51812dc3A010C7d01b50e0d17dc79C8") as any
    let signer2 = await ethers.getSigner("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC") as any

    const countryMinterAddress = metadata.HARDHAT.countryminter.address;
    const countryMinterAbi = metadata.HARDHAT.countryminter.ABI;
    const countryminter = new ethers.Contract(countryMinterAddress, countryMinterAbi, signer0);
  
    const forcesContractAddress = metadata.HARDHAT.forcescontract.address;
    const forcesContractAbi = metadata.HARDHAT.forcescontract.ABI;
    const forcescontract = new ethers.Contract(forcesContractAddress, forcesContractAbi, signer0);

    const warbucksContractAddress = metadata.HARDHAT.warbucks.address;
    const warbucksContractAbi = metadata.HARDHAT.warbucks.ABI;
    const warbucks = new ethers.Contract(warbucksContractAddress, warbucksContractAbi, signer0);

    const TreasuryContractAddress = metadata.HARDHAT.treasurycontract.address;
    const TreasuryContractAbi = metadata.HARDHAT.treasurycontract.ABI;
    const treasurycontract = new ethers.Contract(TreasuryContractAddress, TreasuryContractAbi, signer0) as TreasuryContract;

    const InfrastructureContractAddress = metadata.HARDHAT.infrastructurecontract.address;
    const InfrastructureContractAbi = metadata.HARDHAT.infrastructurecontract.ABI;
    const infrastructuremarketplace = new ethers.Contract(InfrastructureContractAddress, InfrastructureContractAbi, signer0) as InfrastructureMarketContract;

    const TechnologyMarketContractAddress = metadata.HARDHAT.technologymarketcontract.address;
    const TechnologyMarketContractAbi = metadata.HARDHAT.technologymarketcontract.ABI;
    const technologymarketcontrat = new ethers.Contract(TechnologyMarketContractAddress, TechnologyMarketContractAbi, signer0) as TechnologyMarketContract;

    const MilitaryContractAddress = metadata.HARDHAT.militarycontract.address;
    const MilitaryContractAbi = metadata.HARDHAT.militarycontract.ABI;
    const militarycontract = new ethers.Contract(MilitaryContractAddress, MilitaryContractAbi, signer0) as MilitaryContract;

    await countryminter.connect(signer1).generateCountry(
        "TestRuler",
        "TestNationName",
        "TestCapitalCity",
        "TestNationSlogan"
    )
    await warbucks.connect(signer0).approve(warbucks.address, BigInt(10000000000*(10**18)));
    await warbucks.connect(signer0).transfer(signer1.address, BigInt(10000000000*(10**18)));
    await treasurycontract.connect(signer1).addFunds(BigInt(10000000000*(10**18)), 0);
    await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 5000)
    await technologymarketcontrat.connect(signer1).buyTech(0, 1000)
    await forcescontract.connect(signer1).buySoldiers(2000, 0)
    await forcescontract.connect(signer1).buyTanks(40, 0)
    await forcescontract.connect(signer1).buySpies(30, 0)

    await countryminter.connect(signer2).generateCountry(
        "TestRuler2",
        "TestNationName2",
        "TestCapitalCity2",
        "TestNationSlogan2"
    )
    await warbucks.connect(signer0).approve(warbucks.address, BigInt(2000000000*(10**18)));
    await warbucks.connect(signer0).transfer(signer2.address, BigInt(2000000000*(10**18)));
    await treasurycontract.connect(signer2).addFunds(BigInt(2000000000*(10**18)), 1);
    await infrastructuremarketplace.connect(signer2).buyInfrastructure(1, 5000)
    await technologymarketcontrat.connect(signer2).buyTech(1, 300)
    await forcescontract.connect(signer2).buySoldiers(1000, 1)
    await forcescontract.connect(signer2).buyTanks(20, 1)

    await militarycontract.connect(signer1).toggleWarPeacePreference(0)
    await militarycontract.connect(signer2).toggleWarPeacePreference(1)

    console.log("Spy Operation Test Initiated")
}

initiateSpyOperationTest().catch((error) => {
    console.error(error)
    process.exitCode = 1
})