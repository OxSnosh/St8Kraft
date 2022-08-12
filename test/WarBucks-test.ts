import { expect } from "chai"
import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { INITIAL_SUPPLY } from "../helper-hardhat-config"
import { WarBucks } from "../typechain-types"

describe("WarBucks", function () {

    let WarBucks: WarBucks
    let owner: SignerWithAddress
    let addr1: SignerWithAddress
    let addr2: SignerWithAddress
    let addrs

    beforeEach(async function () {
        let WarBucksFactory = await ethers.getContractFactory("WarBucks")
        ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()
        WarBucks = await WarBucksFactory.deploy(INITIAL_SUPPLY) as WarBucks
    })

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await WarBucks.owner()).to.equal(owner.address)
        })

        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await WarBucks.balanceOf(owner.address)
            expect(await WarBucks.totalSupply()).to.equal(ownerBalance)
        })
    })

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {

            await WarBucks.transfer(addr1.address, 50)
            const addr1Balance = await WarBucks.balanceOf(addr1.address)
            expect(addr1Balance).to.equal(50)

            await WarBucks.connect(addr1).transfer(addr2.address, 50)
            const addr2Balance = await WarBucks.balanceOf(addr2.address)
            expect(addr2Balance).to.equal(50)
        })

        it("Should fail if sender doesn't have enough tokens", async function () {
            const initialOwnerBalance = await WarBucks.balanceOf(owner.address)

            await expect(
                WarBucks.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance")

            expect(await WarBucks.balanceOf(owner.address)).to.equal(
                initialOwnerBalance
            )
        })

        it("Should update balances after transfers", async function () {
            const initialOwnerBalance = await WarBucks.balanceOf(owner.address)

            await WarBucks.transfer(addr1.address, 100)

            await WarBucks.transfer(addr2.address, 50)

            const finalOwnerBalance = await WarBucks.balanceOf(owner.address)
            expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150))

            const addr1Balance = await WarBucks.balanceOf(addr1.address)
            expect(addr1Balance).to.equal(100)

            const addr2Balance = await WarBucks.balanceOf(addr2.address)
            expect(addr2Balance).to.equal(50)
        })
    })
})
