const ethers = require("ethers");
const metadata = require("../backend/script-metadata.json")

async function connect () {
    if (typeof window.ethereum !== undefined) {
        console.log("we see Metamask")
        await ethereum.request({method: "eth_requestAccounts"})
    }
} 

async function execute () {
    const abi = metadata.HARDHAT.countryminter.ABI
    const address = metadata.HARDHAT.countryminter.address
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(address, abi, signer)

    await contract.generateCountry("Meenkid", "Hyperborea", "New York", "get some!");
}

module.exports = {
    connect,
    execute
}