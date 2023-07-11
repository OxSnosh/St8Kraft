import { expect } from "chai"
import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { INITIAL_SUPPLY } from "../helper-hardhat-config"
import { TreasuryContract, WarBucks, CountryMinter } from "../typechain-types"

describe("WarBucks", function () {
  
  let warbucks: WarBucks
  let treasurycontract: TreasuryContract
  let countryMinter: CountryMinter

  let signer0: SignerWithAddress
  let signer1: SignerWithAddress
  let signer2: SignerWithAddress
  let signers: SignerWithAddress[]
  let addrs

  beforeEach(async function () {

      signers = await ethers.getSigners();
      signer0 = signers[0];
      signer1 = signers[1];
      signer2 = signers[2];
  
      const WarBucks = await ethers.getContractFactory("WarBucks")
      warbucks = await WarBucks.deploy(INITIAL_SUPPLY) as WarBucks
      await warbucks.deployed()
      // console.log(`WarBuks token deployed to ${warbucks.address}`)
  
      const TreasuryContract = await ethers.getContractFactory("TreasuryContract")
      treasurycontract = await TreasuryContract.deploy() as TreasuryContract
      await treasurycontract.deployed()
      // console.log(`TreasuryContract deployed to ${treasurycontract.address}`)

      const CountryMinter = await ethers.getContractFactory("CountryMinter");
      countryMinter = await CountryMinter.deploy() as CountryMinter;
      await countryMinter.deployed(); 

      warbucks.settings(
        treasurycontract.address,
        countryMinter.address
      )
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await warbucks.owner()).to.equal(signer0.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await warbucks.balanceOf(signer0.address);
      expect(await warbucks.totalSupply()).to.equal(ownerBalance);
    });

    it("Tests that ownership can ba transferred correctly", async function () {
        await warbucks.connect(signer0).transferOwnership(signer1.address);
        const owner = await warbucks.owner();
        expect(owner).to.equal(signer1.address);
    })
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {

      await warbucks.transfer(signer1.address, 50);
      const addr1Balance = await warbucks.balanceOf(signer1.address);
      expect(addr1Balance).to.equal(50);

      await warbucks.connect(signer1).transfer(signer2.address, 50);
      const addr2Balance = await warbucks.balanceOf(signer2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      await expect(
        warbucks.connect(signer1).transfer(signer0.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await warbucks.balanceOf(signer0.address);

      await warbucks.transfer(signer1.address, 100);

      await warbucks.transfer(signer2.address, 50);

      const finalOwnerBalance = await warbucks.balanceOf(signer0.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await warbucks.balanceOf(signer1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await warbucks.balanceOf(signer2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
