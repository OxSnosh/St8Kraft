//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MetaNationsGovToken is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("MetaNationsGovToken", "MNT") {
        _mint(msg.sender, initialSupply);
    }
}
