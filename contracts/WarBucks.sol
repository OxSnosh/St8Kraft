//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ERC20 Contract WarBucks
/// @author OxSnosh
/// @dev This is the contact for the currency used to purchase items in the game
/// @dev Inherits from OpenZeppelin ERC20 and Ownable
/// @dev The deployer of the contract will be the owner
contract WarBucks is ERC20, Ownable {
    address treasury;

    /// @param initialSupply is the inital supply of WarBucks currency
    /// @dev The initial supply is minted to the deployer of the contract
    constructor(uint256 initialSupply) ERC20("WarBucks", "WB") {
        _mint(msg.sender, initialSupply);
    }

    /// @dev This modifier exists in order to allow the TreasuryContract to mint and burn tokens
    modifier onlyTreasury() {
        require(
            msg.sender == treasury,
            "function only callable from treasury contract"
        );
        _;
    }

    /// @dev This function is called by the owner after deployment in order to update the treasury contract address for the onlyTreasury modifer
    /// @param _treasury is the address of the treasury contract
    function settings(address _treasury) public onlyOwner {
        treasury = _treasury;
    }

    /// @dev This function can only be called from the treasury contract
    function mintFromTreasury(
        address account,
        uint256 amount
    ) external onlyTreasury {
        _mint(account, amount);
    }

    /// @dev This function can only be called from the treasury contract
    function burnFromTreasury(
        address account,
        uint256 amount
    ) external onlyTreasury {
        _burn(account, amount);
    }
}
