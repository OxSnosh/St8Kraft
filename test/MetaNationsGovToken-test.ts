import { expect } from "chai"
import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { INITIAL_SUPPLY } from "../helper-hardhat-config"
import { MetaNationsGovToken } from "../typechain-types"

describe("MetaNationsGovToken", function () {

  let MetaNationsGovToken: MetaNationsGovToken
  let owner: SignerWithAddress
  let addr1: SignerWithAddress
  let addr2: SignerWithAddress
  let addrs;

  beforeEach(async function () {
    let MetaNationsGovTokenFactory = await ethers.getContractFactory("MetaNationsGovToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    MetaNationsGovToken = await MetaNationsGovTokenFactory.deploy(INITIAL_SUPPLY) as MetaNationsGovToken;
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await MetaNationsGovToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await MetaNationsGovToken.balanceOf(owner.address);
      expect(await MetaNationsGovToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {

      await MetaNationsGovToken.transfer(addr1.address, 50);
      const addr1Balance = await MetaNationsGovToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      await MetaNationsGovToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await MetaNationsGovToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await MetaNationsGovToken.balanceOf(owner.address);

      await expect(
        MetaNationsGovToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      expect(await MetaNationsGovToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await MetaNationsGovToken.balanceOf(owner.address);

      await MetaNationsGovToken.transfer(addr1.address, 100);

      await MetaNationsGovToken.transfer(addr2.address, 50);

      const finalOwnerBalance = await MetaNationsGovToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await MetaNationsGovToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await MetaNationsGovToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});