//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "hardhat/console.sol";

///@title Test contract for testing external adpaters
///@author OxSnosh
///@dev this contact inherits from openzeppelin's ownable contract
///@dev this contract inherits from chanlinks VRF contract
contract Test is Ownable, ChainlinkClient {
    using Chainlink for Chainlink.Request;

    uint product;

    bytes32 jobId;
    address oracleAddress;
    uint256 fee;

    function updateJobId(bytes32 _jobId) public onlyOwner {
        jobId = _jobId;
    }

    function updateOracleAddress(address _oracleAddress) public onlyOwner {
        setChainlinkOracle(_oracleAddress);
    }

    function updateFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    function updateLinkAddress(address _linkAddress) public onlyOwner {
        setChainlinkToken(_linkAddress);
    }

    function multiplyBy1000(
        uint256 inputNumber
    ) public {
        console.log(fee, "fee");
        // string memory jobIdDecoded = abi.decode(bytes(jobId), (string));
        Chainlink.Request memory req = buildOperatorRequest(
            jobId,
            this.returnProduct.selector
        );
        req.addUint("inputNumber", inputNumber);
        console.log("maybe, maybe");
        sendOperatorRequest(req, fee);
        console.log("completed operator request");
    }

    function returnProduct(
        uint256 _product
    ) public {
        product = _product;
    }

    function getProduct() public view returns (uint256) {
        return product;
    }
}