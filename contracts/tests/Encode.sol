//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "hardhat/console.sol";

contract Encode {

    uint[] input = [0, 0, 0, 0, 0, 0, 0, 0, 20]; 

    function encodeArray() public view returns (bytes memory, bytes memory) {
        bytes memory encode = abi.encode(input);
        bytes memory encodePacked = abi.encodePacked(input);
        return (encode, encodePacked);
    }
}