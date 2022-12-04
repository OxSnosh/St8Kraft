import { expect } from "chai"
import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { INITIAL_SUPPLY } from "../helper-hardhat-config"
import { MetaNationsGovToken } from "../typechain-types"

describe("MetaNationsGovToken", function () {

  let metanationsgovtoken: MetaNationsGovToken

  let signer0: SignerWithAddress
  let signer1: SignerWithAddress
  let signer2: SignerWithAddress
  let signers: SignerWithAddress[]

  beforeEach(async function () {

      signers = await ethers.getSigners();
      signer0 = signers[0];
      signer1 = signers[1];
      signer2 = signers[2];
  
      const MetaNatonsGovToken = await ethers.getContractFactory(
          "MetaNationsGovToken"
      )
      metanationsgovtoken = await MetaNatonsGovToken.deploy(INITIAL_SUPPLY) as MetaNationsGovToken
      await metanationsgovtoken.deployed()
      // console.log(`MetaNationsGovToken deployed to ${metanationsgovtoken.address}`)

  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await metanationsgovtoken.owner()).to.equal(signer0.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await metanationsgovtoken.balanceOf(signer0.address);
      expect(await metanationsgovtoken.totalSupply()).to.equal(ownerBalance);
    });

    it("Tests that ownership can ba transferred correctly", async function () {
        await metanationsgovtoken.connect(signer0).transferOwnership(signer1.address);
        const owner = await metanationsgovtoken.owner();
        expect(owner).to.equal(signer1.address);
    })
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {

      await metanationsgovtoken.transfer(signer1.address, 50);
      const addr1Balance = await metanationsgovtoken.balanceOf(signer1.address);
      expect(addr1Balance).to.equal(50);

      await metanationsgovtoken.connect(signer1).transfer(signer2.address, 50);
      const addr2Balance = await metanationsgovtoken.balanceOf(signer2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      await expect(
        metanationsgovtoken.connect(signer1).transfer(signer0.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await metanationsgovtoken.balanceOf(signer0.address);

      await metanationsgovtoken.transfer(signer1.address, 100);

      await metanationsgovtoken.transfer(signer2.address, 50);

      const finalOwnerBalance = await metanationsgovtoken.balanceOf(signer0.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await metanationsgovtoken.balanceOf(signer1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await metanationsgovtoken.balanceOf(signer2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});