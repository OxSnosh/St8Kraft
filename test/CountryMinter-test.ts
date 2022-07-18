import { expect } from "chai"
import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { INITIAL_SUPPLY } from "../helper-hardhat-config"
import { CountryMinter, WarBucks } from "../typechain-types"

describe("CountryMinter", function () {
    let WarBucks: WarBucks  
    let CountryMinter: CountryMinter
    let owner
    let addr1: SignerWithAddress
    let addr2
    let addrs

    beforeEach(async function () {
        let WarBucksFactory = await ethers.getContractFactory("WarBucks");
        WarBucks = await WarBucksFactory.deploy(INITIAL_SUPPLY) as WarBucks;

        let CountryMinterFactory = await ethers.getContractFactory("CountryMinter");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        CountryMinter = await CountryMinterFactory.deploy(WarBucks.address) as CountryMinter;

        // ICountryMinter = await ethers.getContractFactory("ICountryMinter");
        // icountryminter = await ICountryMinter.deploy(icountryminter.address);
    });

    describe("Country Mint", function () {
        it("Tests that the nation is set up correctly", async function () {
            await CountryMinter
                .connect(addr1)
                .generateCountry(
                    "TestRuler",
                    "TestNationName",
                    "TestCapitalCity",
                    "TestNationSlogan"
                );
            const { rulerName } = await CountryMinter.idToCountryStruct1(0);
            expect(rulerName).to.equal("TestRuler");
        });
    });
});
