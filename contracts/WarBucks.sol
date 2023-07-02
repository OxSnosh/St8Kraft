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
    address countryMinter;

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

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "function only callable from countryMinter contract"
        );
        _;
    }

    /// @dev This function is called by the owner after deployment in order to update the treasury contract address for the onlyTreasury modifer
    /// @param _treasury is the address of the treasury contract
    /// @param _countryMinter is the address of the countryMinter contract
    function settings(address _treasury, address _countryMinter) public onlyOwner {
        treasury = _treasury;
        countryMinter = _countryMinter;
    }

    /// @dev This function can only be called from the treasury contract
    /// @dev This function enables a nation owner to withdraw in game balance from the treasury contract and mint a corresponding amount of WarBucks tokens into a nations wallet 
    /// @dev WarBucks has 18 decimals as does the in game balance
    /// @param account this is the address of the nation owner and the wallet where the tokens are being minted
    /// @param amount is the amount of tokens being burned
    function mintFromTreasury(
        address account,
        uint256 amount
    ) external onlyTreasury {
        _mint(account, amount);
    }

    /// @dev This function can only be called from the treasury contract
    /// @dev This function enables a nation owner to deposit in game balance into a nation and burn a corresponding amount of WarBucks tokens into a nations wallet
    /// @dev WarBucks has 18 decimals as does the in game balance
    /// @notice This function will burn tokens when they are deposited into a nation. For every token burned, a nations in game balance will increase +1
    /// @param account this is the address of the nation owner and the wallet where the tokens are being burned
    /// @param amount is the amount of tokens being burned
    function burnFromTreasury(
        address account,
        uint256 amount
    ) external onlyTreasury {
        _burn(account, amount);
    }

    function burnFromMint(
        address account,
        uint256 amount
    ) external onlyCountryMinter {
        _burn(account, amount);
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
    }
}
