//SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title MetaNationsGovToken This is the token used to purchase nation NFTs
/// @author OxSnosh
/// @notice This token is spent at the amount equivalent cost in USDC to the seed money of the nation
contract MetaNationsGovToken is ERC20, Ownable {

    /// @param initialSupply is the initial supply minted of MetaNationsGovToekn
    /// @dev the initialSupply is minted to the deployer of the contract
    constructor(uint256 initialSupply) ERC20("MetaNations Governance Token", "MNGT") {
        _mint(msg.sender, initialSupply);
    }
}
