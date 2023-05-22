const {ethers} = require("hardhat");
const metadata = require("../script-metadata.json");
const EthCrypto = require('eth-crypto');
const fs = require('fs');
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// import { Signer } from "ethers";
// import { TreasuryContract } from '../typechain-types/contracts/Treasury.sol/TreasuryContract';
// import { TechnologyMarketContract } from '../typechain-types/contracts/TechnologyMarket.sol/TechnologyMarketContract';
// import { ForcesContract } from '../typechain-types/contracts/Forces.sol/ForcesContract';
// import { MilitaryContract } from '../typechain-types/contracts/Military.sol/MilitaryContract';
// import { WarContract } from '../typechain-types/contracts/War.sol/WarContract';
// import { CountryMinter } from '../typechain-types/contracts/CountryMinter';
// import { InfrastructureMarketContract } from "../typechain-types";

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545")

const initiateSpyOperationTest = async () => {

    const signer0 = provider.getSigner(0)
    const signer1 = provider.getSigner(1)
    const signer2 = provider.getSigner(2)
    
    const signer1Address = await signer1.getAddress()
    const signer2Address = await signer2.getAddress()

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
    const treasurycontract = new ethers.Contract(TreasuryContractAddress, TreasuryContractAbi, signer0)

    const InfrastructureContractAddress = metadata.HARDHAT.infrastructurecontract.address;
    const InfrastructureContractAbi = metadata.HARDHAT.infrastructurecontract.ABI;
    const infrastructuremarketplace = new ethers.Contract(InfrastructureContractAddress, InfrastructureContractAbi, signer0)

    const TechnologyMarketContractAddress = metadata.HARDHAT.technologymarketcontract.address;
    const TechnologyMarketContractAbi = metadata.HARDHAT.technologymarketcontract.ABI;
    const technologymarketcontrat = new ethers.Contract(TechnologyMarketContractAddress, TechnologyMarketContractAbi, signer0)

    const MilitaryContractAddress = metadata.HARDHAT.militarycontract.address;
    const MilitaryContractAbi = metadata.HARDHAT.militarycontract.ABI;
    const militarycontract = new ethers.Contract(MilitaryContractAddress, MilitaryContractAbi, signer0)

    await countryminter.connect(signer1).generateCountry(
        "TestRuler",
        "TestNationName",
        "TestCapitalCity",
        "TestNationSlogan"
    )
    await warbucks.connect(signer0).approve(warbucks.address, BigInt(10000000000*(10**18)));
    await warbucks.connect(signer0).transfer(signer1Address, BigInt(10000000000*(10**18)));
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
    await warbucks.connect(signer0).transfer(signer2Address, BigInt(2000000000*(10**18)));
    await treasurycontract.connect(signer2).addFunds(BigInt(2000000000*(10**18)), 1);
    await infrastructuremarketplace.connect(signer2).buyInfrastructure(1, 5000)
    await technologymarketcontrat.connect(signer2).buyTech(1, 300)
    await forcescontract.connect(signer2).buySoldiers(1000, 1)
    await forcescontract.connect(signer2).buyTanks(20, 1)

    await militarycontract.connect(signer1).toggleWarPeacePreference(0)
    await militarycontract.connect(signer2).toggleWarPeacePreference(1)

    console.log("Spy Operation Test Initiated")

    var message = "0" // nationId
    var signature = await signer1.signMessage(message)
    console.log("Signature: ", signature)
    
    var identityOne = await EthCrypto.createIdentity()
    const publicKey = identityOne.publicKey

    const path  = "../MetaNations-external-adapters/.env"
    fs.appendFileSync(path, "\n" +"PRIVATE_KEY=" + identityOne.privateKey)

    const encrypted = await EthCrypto.encryptWithPublicKey(
        publicKey, // publicKey
        signature // message
      );
    console.log("encrypted: ", encrypted)
    var cipherString = EthCrypto.cipher.stringify(encrypted);
    console.log("cipherString: ", cipherString)

    var cipherParsed = EthCrypto.cipher.parse(cipherString);
    console.log("cipherParsed: ", cipherParsed)
    var decrypted = await EthCrypto.decryptWithPrivateKey(
        identityOne.privateKey, // privateKey
        cipherParsed // encrypted-data
    );
    console.log("decrypted: ", decrypted)

    var signerAddress = await ethers.utils.verifyMessage(message, decrypted)
    console.log("signerAddress: ", signerAddress)
    console.log("signer1Address: ", signer1Address)
}

initiateSpyOperationTest().catch((error) => {
    console.error(error)
    process.exitCode = 1
})